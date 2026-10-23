import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/**
 * Maps backend field errors (e.g. { repoUrl: "already submitted" }) onto the matching react-hook-form fields.
 * Returns a form-level message only when nothing could be mapped to a field (so the UI can show it as a banner/toast).
 */
export function applyServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  res: { message: string; fieldErrors?: Record<string, string> },
): string | null {

  const known = Object.keys(form.getValues());

  let mapped = false;


  for (const [field, message] of Object.entries(res.fieldErrors ?? {})) {

    if (known.includes(field)) {
      form.setError(field as Path<T>, { type: "server", message });

      mapped = true;
    }
  }



  if (mapped) {

    const first = Object.keys(res.fieldErrors ?? {}).find((f) => known.includes(f));

    if (first) form.setFocus(first as Path<T>);

    return null;
  }


  return res.message;
}
