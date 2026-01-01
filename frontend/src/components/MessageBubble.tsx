type Props = {
  sender: "user" | "ai" | "system";
  text: string;
  label?: string;
};

export function MessageBubble({ sender, text, label }: Props) {
  return (
    <div className={`bubble ${sender}`}>
      {label && <div className="label">{label}</div>}
      <div>{text}</div>
    </div>
  );
}
