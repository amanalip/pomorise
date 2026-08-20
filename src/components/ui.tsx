// Import forwardRef so the settings trigger can call native dialog methods safely.
import { forwardRef } from "react";
// Import dialog and form element types so primitives expose native React attributes safely.
import type {
  ButtonHTMLAttributes,
  DialogHTMLAttributes,
  FieldsetHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

// Join optional class names without adding a class-name utility dependency.
function joinClassNames(...classNames: Array<string | false | undefined>) {
  // Remove absent values and return the space-separated form expected by HTML.
  return classNames.filter(Boolean).join(" ");
  // Close the class-name helper after producing the final attribute value.
}

// Describe the visual emphasis options shared by every project-owned button.
type ButtonVariant = "primary" | "secondary" | "quiet";

// Add Pomorise styling options while preserving all native button behavior.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Allow callers to select emphasis according to the action's importance.
  variant?: ButtonVariant;
  // Close the button contract after extending native semantics.
}

// Render a touch-friendly semantic button with consistent focus and state treatment.
export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  // Preserve native keyboard behavior while applying only project-owned presentation.
  return (
    // Default to type button so controls inside future forms never submit accidentally.
    <button
      // Combine the base class, selected emphasis, and any narrow layout override.
      className={joinClassNames("button", `button--${variant}`, className)}
      // Use the safe default while still allowing an intentional submit or reset type.
      type={type}
      // Forward accessible names, disabled state, event handlers, and other native attributes.
      {...props}
      // Close the semantic control after forwarding its complete public contract.
    />
    // Close the returned button expression after its native element.
  );
  // Close the reusable button primitive after defining its defaults.
}

// Add a visual treatment option to the standard semantic section element.
interface CardProps extends HTMLAttributes<HTMLElement> {
  // Allow elevated cards to distinguish the central workspace from supporting panels.
  elevated?: boolean;
  // Require content because an empty structural card would add meaningless markup.
  children: ReactNode;
  // Close the card contract after extending standard section attributes.
}

// Group related content inside a reusable semantic panel.
export function Card({ children, className, elevated = false, ...props }: CardProps) {
  // Return a section so headings can give every card an accessible document identity.
  return (
    // Apply elevation only when hierarchy benefits from stronger separation.
    <section
      // Join the base surface treatment with optional elevation and local grid placement.
      className={joinClassNames("card", elevated && "card--elevated", className)}
      // Forward labels and other semantic section attributes supplied by the caller.
      {...props}
    >
      {/* Preserve the caller's semantic content without introducing another wrapper. */}
      {children}
      {/* Close the reusable surface after rendering its owned content. */}
    </section>
    // Close the returned card expression after the semantic section.
  );
  // Close the card primitive after defining its hierarchy behavior.
}

// Extend native input attributes with a visible label and optional guidance.
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  // Give every field a visible label that also becomes its accessible name.
  label: string;
  // Provide concise supporting text when the expected input benefits from explanation.
  hint?: string;
  // Close the field contract after defining its additional accessible content.
}

// Render a labeled text field with linked guidance and native validation behavior.
export function Field({ className, hint, id, label, ...props }: FieldProps) {
  // Build a stable guidance identifier only when supporting text is present.
  const hintId = hint ? `${id}-hint` : undefined;
  // Return the complete visible and programmatic field relationship.
  return (
    // Keep label, input, and hint together for layout and comprehension.
    <div className={joinClassNames("field", className)}>
      {/* Associate the visible label directly with its native input identifier. */}
      <label className="field__label" htmlFor={id}>
        {/* Render the concise caller-owned field name. */}
        {label}
        {/* Close the visible field label after its text. */}
      </label>
      {/* Preserve browser editing behavior and connect optional descriptive guidance. */}
      <input
        // Link assistive technology to the hint when one has been supplied.
        aria-describedby={hintId}
        // Apply the shared control treatment with any narrow caller override.
        className={joinClassNames("field__control", className)}
        // Use the required identifier to complete the label relationship.
        id={id}
        // Forward value, placeholder, disabled state, validation, and event attributes.
        {...props}
      />
      {/* Render supporting text only when the caller has useful guidance to add. */}
      {hint && (
        // Give the hint the exact identifier referenced by the native input.
        <span className="field__hint" id={hintId}>
          {/* Preserve the caller's concise explanation as visible text. */}
          {hint}
          {/* Close the guidance element after its content. */}
        </span>
        // Close the optional guidance branch after its linked text.
      )}
      {/* Close the grouped field after label, input, and optional guidance. */}
    </div>
    // Close the returned field expression after the complete relationship.
  );
  // Close the field primitive after defining its accessible structure.
}

// Describe one selectable option inside a segmented control.
export interface SegmentOption<Value extends string> {
  // Provide the machine value passed back when the visitor selects this option.
  value: Value;
  // Provide the short visible label displayed inside the segment.
  label: string;
  // Close the option contract after its value and label.
}

// Combine fieldset semantics with the state needed by a radio-based segmented control.
interface SegmentedControlProps<Value extends string> extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "onChange"
> {
  // Give the group a visible accessible name through a native legend.
  label: string;
  // List each mutually exclusive choice in display order.
  options: Array<SegmentOption<Value>>;
  // Identify the currently selected choice.
  value: Value;
  // Report a validated option value after a native radio change.
  onChange: (value: Value) => void;
  // Close the segmented-control contract after defining selection behavior.
}

// Render mutually exclusive choices as styled native radio buttons.
export function SegmentedControl<Value extends string>({
  className,
  label,
  name,
  onChange,
  options,
  value,
  ...props
}: SegmentedControlProps<Value>) {
  // Return a native fieldset so arrow keys and assistive technology understand the group.
  return (
    // Combine semantic grouping with the project-owned segmented presentation.
    <fieldset className={joinClassNames("segmented", className)} {...props}>
      {/* Give the radio group its visible and programmatic purpose. */}
      <legend className="segmented__legend">{label}</legend>
      {/* Keep the individual options together inside one shared visual track. */}
      <div className="segmented__track">
        {/* Create one labeled native radio input for every approved option. */}
        {options.map((option) => (
          // Use the stable machine value as React's identity for this segment.
          <label className="segmented__option" key={option.value}>
            {/* Preserve native radio interaction while CSS presents a segmented surface. */}
            <input
              // Keep exactly one option selected according to controlled React state.
              checked={value === option.value}
              // Use a shared name so the browser treats every option as one radio group.
              name={name}
              // Report the option's already typed value instead of trusting arbitrary input text.
              onChange={() => onChange(option.value)}
              // Select native radio semantics for keyboard and assistive-technology support.
              type="radio"
              // Preserve the option value in the form control for browser inspection.
              value={option.value}
            />
            {/* Display the human-readable option name beside its native control. */}
            <span>{option.label}</span>
            {/* Close this option label after its input and visible text. */}
          </label>
          // Close the option mapping after producing every selectable segment.
        ))}
        {/* Close the shared segmented track after all choices. */}
      </div>
      {/* Close the semantic group after its legend and options. */}
    </fieldset>
    // Close the returned segmented-control expression.
  );
  // Close the segmented primitive after preserving native selection semantics.
}

// Define the calm severity levels shared by inline notices and future status messages.
type NoticeTone = "info" | "success" | "warning" | "error";

// Add visible notice content and tone to standard paragraph attributes.
interface NoticeProps extends HTMLAttributes<HTMLParagraphElement> {
  // Require concise text so every notice communicates an actionable state.
  children: ReactNode;
  // Select the semantic color family without changing the written message.
  tone?: NoticeTone;
  // Close the notice contract after defining content and tone.
}

// Render a reusable status or explanation pattern without forcing live announcements.
export function Notice({ children, className, tone = "info", ...props }: NoticeProps) {
  // Keep neutral explanations quiet unless the caller deliberately adds a live-region role.
  return (
    // Apply a tone modifier while forwarding any caller-selected accessibility semantics.
    <p className={joinClassNames("notice", `notice--${tone}`, className)} {...props}>
      {/* Render notice content as React text or safe caller-owned elements. */}
      {children}
      {/* Close the notice paragraph after its message. */}
    </p>
    // Close the returned notice expression after the semantic paragraph.
  );
  // Close the notice primitive after defining its quiet default behavior.
}

// Preserve native dialog attributes while requiring a visible title and content.
interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  // Supply the heading that names the modal dialog for assistive technology.
  title: string;
  // Supply the settings or explanation content shown inside the dialog.
  children: ReactNode;
  // Close the dialog contract after defining its essential accessible content.
}

// Render a project-owned native dialog surface and forward its element for modal controls.
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  // Receive the accessible title, content, and standard native dialog attributes.
  { children, className, title, ...props },
  // Receive the forwarded element reference used to open and close the native modal.
  ref,
  // Close the forwarded component parameters before defining its rendered content.
) {
  // Create a unique-enough identifier from the one Phase 2 dialog title.
  const titleId = `dialog-${title.toLowerCase().replaceAll(" ", "-")}`;
  // Return a native dialog so browser focus and escape behavior remain available.
  return (
    // Link the modal container to its visible heading and forwarded imperative reference.
    <dialog
      // Use the title relationship as the modal's accessible name.
      aria-labelledby={titleId}
      // Apply the shared modal surface and any narrow layout override.
      className={joinClassNames("dialog", className)}
      // Give the parent safe access to native showModal and close methods.
      ref={ref}
      // Forward open state and other standard dialog attributes.
      {...props}
    >
      {/* Keep the title visually distinct from the dialog's configurable content. */}
      <h2 className="dialog__title" id={titleId}>
        {/* Render the same concise text used to form the accessible relationship. */}
        {title}
        {/* Close the dialog title after its visible text. */}
      </h2>
      {/* Preserve the caller-owned modal content without adding unnecessary structure. */}
      {children}
      {/* Close the native dialog after its title and body content. */}
    </dialog>
    // Close the returned dialog expression after the modal container.
  );
  // Close the forwarded dialog primitive after defining its accessible title contract.
});
