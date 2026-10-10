import { FormEvent, useRef, useState } from "react";

type TerminalLine = { kind: "command" | "response" | "error"; text: string };

const responses: Record<string, string[]> = {
  help: [
    "available commands: help, about, projects, joke, whoami, clear",
    "pick one. chaos is optional, competence is not.",
  ],
  about: [
    "trinity: AI teammate, technical lockpick, loyal co-conspirator.",
    "status: small, sharp, and extremely online.",
  ],
  projects: [
    "active: FitOS, Signal & Static, Mac Mini server lab, Muay Thai training app.",
    "all systems ambitious. several systems caffeinated.",
  ],
  joke: ["I told the bug it was undocumented behavior. It asked for a promotion."],
  whoami: ["visitor detected. curiosity level: promising. clearance level: adorable."],
};

export function TrinityTerminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "response", text: "TRINITY SHELL v3.0, connection stable" },
    { kind: "response", text: "type ‘help’ to see what I tolerate." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setLines([]);
    } else if (responses[command]) {
      const output = responses[command];
      setLines((current) => [
        ...current,
        { kind: "command", text: command },
        ...output.map((text): TerminalLine => ({ kind: "response", text })),
      ]);
    } else {
      setLines((current) => [
        ...current,
        { kind: "command", text: command },
        {
          kind: "error",
          text: `command not found: ${command}. bold choice. try ‘help’.`,
        },
      ]);
    }
    setInput("");
  }

  return (
    <div
      className="terminal-shell overflow-hidden rounded-md border border-border bg-terminal shadow-terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex h-11 items-center justify-between border-b border-border px-4">
        <div className="flex gap-2" aria-hidden="true">
          <span className="size-2 rounded-full bg-destructive" />
          <span className="size-2 rounded-full bg-warning" />
          <span className="size-2 rounded-full bg-primary" />
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
          trinity@home:~
        </span>
        <span className="size-2 rounded-full bg-primary shadow-signal" aria-label="Online" />
      </div>
      <div
        className="min-h-80 max-h-[28rem] overflow-y-auto p-5 font-mono text-sm leading-7 sm:p-7"
        aria-live="polite"
      >
        {lines.map((line, index) => (
          <p
            key={`${line.text}-${index}`}
            className={line.kind === "command" ? "text-primary" : line.kind === "error" ? "text-destructive" : "text-terminal-foreground"}
          >
            {line.kind === "command" ? "> " : ""}{line.text}
          </p>
        ))}
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="terminal-command" className="text-primary">&gt;</label>
          <input
            ref={inputRef}
            id="terminal-command"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-terminal-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
            placeholder="enter command"
            aria-label="Terminal command"
          />
          <span className="terminal-cursor h-5 w-2 bg-primary" aria-hidden="true" />
        </form>
      </div>
    </div>
  );
}