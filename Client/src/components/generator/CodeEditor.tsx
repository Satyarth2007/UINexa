import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { FileCode2 } from "lucide-react";

const langFor = (p: string) => (p.endsWith(".css") ? [css()] : p.endsWith(".js") ? [javascript()] : [html()]);

interface Props {
  files: Record<string, string>;
  onChange: (path: string, value: string) => void;
}

export default function CodeEditor({ files, onChange }: Props) {
  const paths = Object.keys(files);
  const [active, setActive] = useState(paths[0]);
  const current = files[active] !== undefined ? active : paths[0];
  const extensions = useMemo(() => [...langFor(current), EditorView.lineWrapping], [current]);

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-border bg-surface-2 p-2">
        {paths.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActive(p)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${
              p === current ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            {p}
          </button>
        ))}
      </div>
      <CodeMirror
        value={files[current] ?? ""}
        height="560px"
        theme={oneDark}
        extensions={extensions}
        onChange={(value) => onChange(current, value)}
        basicSetup={{ foldGutter: false }}
      />
    </div>
  );
}