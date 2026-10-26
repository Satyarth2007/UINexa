import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Loader2, AlertCircle, Save, Wand2, Plus } from "lucide-react";
import { Button } from "../components/ui/Button"; // ADAPT path
import CustomizePanel, {
    DEFAULT_SETTINGS, getSettingsError, toPayload, type Settings,
} from "../components/generator/CustomizePanel";
import PreviewPane, { type Device } from "../components/generator/PreviewPane";
import CodeEditor from "../components/generator/CodeEditor";
import { useGenerate, useGeneration, useRefine, useSaveFiles, useVersions, useAddPage, getErrorMessage } from "../hooks/useGenerate";
import type { GenerationResponse } from "../types/generate";


const MAX = 2000;
type Files = Record<string, string>;

const sameFiles = (a: Files, b: Files) => {
    const ka = Object.keys(a);
    return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
};
const slugOf = (page: string) => page.replace(/^\//, "").replace(/\.html$/, "");

export default function GeneratePage() {
    const [params, setParams] = useSearchParams();
    const idParam = params.get("id");

    const [prompt, setPrompt] = useState(params.get("prompt") ?? "");
    const [multiPage, setMultiPage] = useState(false);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [instruction, setInstruction] = useState("");

    const [result, setResult] = useState<GenerationResponse | null>(null);
    const [draft, setDraft] = useState<Files>({});
    const [previewFiles, setPreviewFiles] = useState<Files>({});
    const [page, setPage] = useState("/index.html");
    const [view, setView] = useState<"preview" | "code">("preview");
    const [device, setDevice] = useState<Device>("desktop");

    const addPage = useAddPage();
    const [addOpen, setAddOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const generate = useGenerate();
    const refine = useRefine();
    const save = useSaveFiles();
    const loaded = useGeneration(idParam);
    const versions = useVersions(result?.id ?? null, result?.rootId ?? null);

    const settingsError = getSettingsError(settings);
    const canSubmit = prompt.trim().length >= 10 && !generate.isPending && !settingsError;
    const dirty = result ? !sameFiles(draft, result.files) : false;
    const busy = generate.isPending || refine.isPending || addPage.isPending;

    const show = (r: GenerationResponse, keepPage?: string) => {
        setResult(r);
        setDraft(r.files);
        setPreviewFiles(r.files);
        setInstruction("");
        const firstHtml = r.files["/index.html"] ? "/index.html" : Object.keys(r.files).find((p) => p.endsWith(".html"));
        setPage(keepPage && r.files[keepPage] ? keepPage : (firstHtml ?? "/index.html"));
    };

    // open a saved generation from ?id=
    useEffect(() => {
        if (loaded.data && loaded.data.id !== result?.id) {
            show(loaded.data);
            setPrompt(loaded.data.prompt);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded.data]);

    // live preview while typing (debounced)
    useEffect(() => {
        const t = setTimeout(() => setPreviewFiles(draft), 400);
        return () => clearTimeout(t);
    }, [draft]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        generate.mutate(
            { prompt: prompt.trim(), multiPage, ...toPayload(settings) },
            {
                onSuccess: (d) => {
                    show(d);
                    setParams({ id: d.id }, { replace: true });
                },
            }
        );
    };

    const handleSave = async () => {
        if (!result) return;
        try {
            await save.mutateAsync({ id: result.id, files: draft });
            setResult({ ...result, files: draft });
        } catch {
            /* error is shown below */
        }
    };

    const handleRefine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!result || instruction.trim().length < 3 || busy) return;
        try {
            if (dirty) await save.mutateAsync({ id: result.id, files: draft }); // refine starts from your edits
            const next = await refine.mutateAsync({
                id: result.id, instruction: instruction.trim(), page: slugOf(page),
            });
            show(next, page);
            setParams({ id: next.id }, { replace: true });
        } catch {
            /* error is shown below */
        }
    };


    const handleAddPage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!result || newTitle.trim().length < 2 || busy) return;
        try {
            if (dirty) await save.mutateAsync({ id: result.id, files: draft });
            const next = await addPage.mutateAsync({
                id: result.id, title: newTitle.trim(), description: newDesc.trim(),
            });
            show(next, next.newPage);
            setParams({ id: next.id }, { replace: true });
            setView("preview");
            setAddOpen(false);
            setNewTitle("");
            setNewDesc("");
        } catch {
            /* error is shown above */
        }
    };

    const openVersion = (id: string) => {
        if (dirty && !window.confirm("Discard your unsaved changes?")) return;
        setParams({ id });
    };

    const errorMsg = [generate.error, refine.error, save.error, addPage.error, loaded.error]
        .filter(Boolean)
        .map((e) => getErrorMessage(e))[0];

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-2xl font-semibold text-foreground">Generate a UI</h1>
            <p className="mt-1 text-sm text-muted">Describe what you want. UInexa builds HTML, CSS and JavaScript files.</p>

            <form onSubmit={submit} className="mt-6 rounded-xl border border-border bg-surface p-4">
                <textarea
                    value={prompt}
                    onChange={(e) => { setPrompt(e.target.value); if (generate.error) generate.reset(); }}
                    maxLength={MAX}
                    rows={4}
                    placeholder="e.g. Pricing page with 3 tiers, a highlighted middle plan and an FAQ section"
                    className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <CustomizePanel value={settings} onChange={setSettings} />

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted">{prompt.length}/{MAX}</span>
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                            <input
                                type="checkbox"
                                checked={multiPage}
                                onChange={(e) => setMultiPage(e.target.checked)}
                                className="h-4 w-4 accent-[var(--color-primary)]"
                            />
                            Multi-page site (2 to 5 pages, slower)
                        </label>
                    </div>
                    <Button type="submit" disabled={!canSubmit}>
                        {generate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {generate.isPending ? "Generating…" : "Generate"}
                    </Button>
                </div>
            </form>

            {errorMsg && (
                <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {errorMsg}
                </div>
            )}

            {generate.isPending && (
                <p className="mt-6 text-sm text-muted">
                    {multiPage
                        ? "Planning pages and building them one by one. This can take 1 to 3 minutes…"
                        : "Building your UI. This usually takes 10 to 40 seconds…"}
                </p>
            )}

            {loaded.isLoading && idParam && !result && <p className="mt-6 text-sm text-muted">Loading…</p>}

            {result && (
                <section className="mt-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="text-sm text-foreground">{result.summary}</p>
                            <p className="mt-1 text-xs text-muted">
                                {result.model} · version {result.version ?? 1}
                            </p>
                        </div>
                        {versions.data && versions.data.length > 1 && (
                            <select
                                value={result.id}
                                onChange={(e) => openVersion(e.target.value)}
                                className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-foreground"
                            >
                                {versions.data.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        v{v.version} · {v.instruction ? v.instruction.slice(0, 40) : "original"}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {!!result.failedPages?.length && (
                        <p className="mt-2 text-xs text-warning">
                            These pages couldn't be generated: {result.failedPages.join(", ")}. Try again to get them.
                        </p>
                    )}

                    <form onSubmit={handleRefine} className="mt-4 flex gap-2">
                        <input
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            maxLength={1000}
                            placeholder={`Describe a change to ${page}, e.g. make the headline bigger and the button green`}
                            className="min-w-0 flex-1 rounded-lg border border-border bg-surface p-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button type="submit" disabled={busy || instruction.trim().length < 3}>
                            {refine.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            {refine.isPending ? "Applying…" : "Apply"}
                        </Button>
                    </form>
                    <p className="mt-1 text-xs text-muted">
                        Changes apply to the page you're viewing. Edits to the shared styles affect every page.
                    </p>

                    <div className="mt-4">
                        {!addOpen ? (
                            <button
                                type="button"
                                onClick={() => setAddOpen(true)}
                                disabled={busy}
                                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-foreground disabled:opacity-50"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add page
                            </button>
                        ) : (
                            <form onSubmit={handleAddPage} className="rounded-lg border border-border bg-surface p-3">
                                <div className="grid gap-2 sm:grid-cols-[200px_1fr_auto]">
                                    <input
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        maxLength={30}
                                        placeholder="Page name, e.g. About"
                                        className="rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        maxLength={300}
                                        placeholder="What should it contain? e.g. our story, team photos and values"
                                        className="rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={busy || newTitle.trim().length < 2}>
                                            {addPage.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                            {addPage.isPending ? "Adding…" : "Create"}
                                        </Button>
                                        <button type="button" onClick={() => setAddOpen(false)} className="px-2 text-xs text-muted hover:text-foreground">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                {addPage.isPending && (
                                    <p className="mt-2 text-xs text-muted">Linking the new page into your menu and building it. This can take up to a minute…</p>
                                )}
                            </form>
                        )}
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
                        <div className="flex items-center justify-between border-b border-border p-2">
                            <div className="flex gap-1">
                                {(["preview", "code"] as const).map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setView(v)}
                                        className={`rounded-md px-4 py-1.5 text-sm capitalize ${view === v ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"
                                            }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            {dirty && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-warning">Unsaved changes</span>
                                    <Button type="button" onClick={handleSave} disabled={save.isPending}>
                                        {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save changes
                                    </Button>
                                </div>
                            )}
                        </div>

                        {view === "preview" ? (
                            <PreviewPane
                                files={previewFiles}
                                page={page}
                                onPageChange={setPage}
                                device={device}
                                onDeviceChange={setDevice}
                            />
                        ) : (
                            <CodeEditor files={draft} onChange={(path, v) => setDraft((d) => ({ ...d, [path]: v }))} />
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}