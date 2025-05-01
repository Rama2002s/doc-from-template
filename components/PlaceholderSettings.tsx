// components/PlaceholderSettings.tsx
interface Format {
  value: string;
  label: string;
  prefix: string;
  suffix: string;
}

interface PlaceholderSettingsProps {
  format: string;
  onFormatChange: (format: string) => void;
  formats: Format[];
}

function generateExampleText(prefix: string, suffix: string) {
  return [
    `Dear ${prefix}firstName${suffix} ${prefix}lastName${suffix},`,
    `Your order #${prefix}orderNumber${suffix} has been processed.`,
    `We will deliver to: ${prefix}address${suffix}, ${prefix}city${suffix}, ${prefix}country${suffix}.`,
    `Total amount: $${prefix}amount${suffix}`,
    `Best regards,\nThe ${prefix}companyName${suffix} Team`
  ].join('\n');
}

export default function PlaceholderSettings({ 
  format, 
  onFormatChange,
  formats = []
}: PlaceholderSettingsProps) {
  const selectedFormat = formats?.find(f => f.value === format);
  const exampleText = selectedFormat 
    ? generateExampleText(selectedFormat.prefix, selectedFormat.suffix)
    : '';

  return (
    <div class="bg-purple-600 rounded-xl p-6 shadow-lg">
      <h3 class="text-xl font-semibold mb-6 text-white">Placeholder Format</h3>
      <div class="space-y-6">
        <div>
          <label 
            htmlFor="format" 
            class="block text-sm font-medium mb-2 text-white/90"
          >
            Select your placeholder format:
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => onFormatChange((e.target as HTMLSelectElement).value)}
            class="
              block w-full px-4 py-2.5
              bg-white/10 
              border border-white/20
              rounded-lg
              text-white
              focus:outline-none focus:ring-2 focus:ring-white/30
              focus:border-transparent
              transition-all duration-200
            "
          >
            {formats?.map(fmt => (
              <option 
                key={fmt.value} 
                value={fmt.value} 
                class="text-purple-600 bg-white"
              >
                {fmt.label}
              </option>
            )) || <option disabled>No formats available</option>}
          </select>
        </div>
        
        {exampleText && (
          <div>
            <label class="block text-sm font-medium mb-2 text-white/90">
              Example Template:
            </label>
            <div class="
              p-4
              bg-white/10
              rounded-lg
              font-mono text-sm
              text-white/90
              whitespace-pre-line
              border border-white/10
            ">
              {exampleText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}