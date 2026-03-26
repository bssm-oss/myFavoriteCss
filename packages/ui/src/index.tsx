import type { JSX, PropsWithChildren, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import clsx from "clsx";

export function AppShell({
  title,
  subtitle,
  children,
  actions
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}>) {
  return (
    <div className="mui-shell">
      <header className="mui-header">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="mui-header-actions">{actions}</div> : null}
      </header>
      <main className="mui-main">{children}</main>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children
}: PropsWithChildren<{
  title: string;
  description?: string;
  actions?: ReactNode;
}>) {
  return (
    <section className="mui-card">
      <div className="mui-card-header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="mui-card-actions">{actions}</div> : null}
      </div>
      <div className="mui-card-body">{children}</div>
    </section>
  );
}

export function Button({
  children,
  tone = "default",
  className,
  ...props
}: PropsWithChildren<JSX.IntrinsicElements["button"] & {
  tone?: "default" | "primary" | "danger" | "ghost";
}>) {
  return (
    <button
      className={clsx("mui-button", `mui-button-${tone}`, className)}
      type={props.type ?? "button"}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral"
}: PropsWithChildren<{
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}>) {
  return <span className={clsx("mui-badge", `mui-badge-${tone}`)}>{children}</span>;
}

export function Toggle({
  checked,
  label,
  description,
  onChange,
  disabled
}: {
  checked: boolean;
  label: string;
  description?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={clsx("mui-toggle", disabled && "is-disabled")}>
      <span className="mui-toggle-copy">
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <input
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="mui-toggle-track" aria-hidden="true">
        <span className="mui-toggle-thumb" />
      </span>
    </label>
  );
}

export function Field({
  label,
  hint,
  children
}: PropsWithChildren<{
  label: string;
  hint?: string;
}>) {
  return (
    <label className="mui-field">
      <span className="mui-field-label">{label}</span>
      {hint ? <span className="mui-field-hint">{hint}</span> : null}
      {children}
    </label>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="mui-input" {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="mui-textarea" {...props} />;
}

export function Notice({
  tone = "info",
  title,
  children
}: PropsWithChildren<{
  tone?: "info" | "warning" | "danger" | "success";
  title: string;
}>) {
  return (
    <div className={clsx("mui-notice", `mui-notice-${tone}`)}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

export function InlineStat({
  label,
  value
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="mui-inline-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function KeyValueList({
  items
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="mui-kv-list">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({
  title,
  body
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mui-empty-state">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}
