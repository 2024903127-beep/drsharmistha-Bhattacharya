import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Prose({ children }: { children: string }) {
  return (
    <div className="prose-clinic">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div> }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
