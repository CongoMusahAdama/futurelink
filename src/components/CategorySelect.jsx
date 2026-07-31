import { EVENT_CATEGORY_OPTIONS } from "../data/events";

/**
 * Category picker: choose a preset or select "Other" / a custom value to type your own.
 */
export default function CategorySelect({
  id = "category",
  name = "category",
  value,
  onChange,
  className = "",
  required = true,
}) {
  const presets = EVENT_CATEGORY_OPTIONS;
  const isCustom = Boolean(value) && !presets.includes(value);
  const selectValue = isCustom ? "__custom__" : value || "Conference";

  const handleSelect = (e) => {
    const next = e.target.value;
    if (next === "__custom__") {
      onChange({ target: { name, value: isCustom ? value : "" } });
      return;
    }
    onChange({ target: { name, value: next } });
  };

  const handleCustom = (e) => {
    onChange({ target: { name, value: e.target.value } });
  };

  return (
    <div className="space-y-2">
      <select
        id={id}
        name={`${name}-select`}
        value={selectValue}
        onChange={handleSelect}
        className={className}
        required={required && !isCustom}
        aria-label="Category"
      >
        {presets.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="__custom__">Add your own…</option>
      </select>

      {(selectValue === "__custom__" || isCustom) && (
        <input
          id={`${id}-custom`}
          name={name}
          type="text"
          required={required}
          value={isCustom || selectValue === "__custom__" ? value : ""}
          onChange={handleCustom}
          placeholder="Type your category"
          className={className}
          autoFocus
        />
      )}
    </div>
  );
}
