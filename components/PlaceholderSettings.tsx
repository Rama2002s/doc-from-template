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
    return `${prefix}firstName${suffix} ${prefix}lastName${suffix}`;
  }
  
  export default function PlaceholderSettings({ 
    format, 
    onFormatChange,
    formats = [] // Provide default empty array
  }: PlaceholderSettingsProps) {
    const selectedFormat = formats?.find(f => f.value === format);
    const exampleText = selectedFormat 
      ? generateExampleText(selectedFormat.prefix, selectedFormat.suffix)
      : '';
  
    return (
      <div class="text-white">
        <h3 class="text-lg font-semibold mb-4">Placeholder Format</h3>
        <div class="space-y-4">
          <div>
            <label 
              htmlFor="format" 
              class="block text-sm font-medium mb-2"
            >
              Select your placeholder format:
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => onFormatChange((e.target as HTMLSelectElement).value)}
              class="block w-full px-3 py-2 bg-white/20 border border-white/30 
                     rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 
                     focus:border-white/50 text-white"
            >
              {formats?.map(fmt => (
                <option key={fmt.value} value={fmt.value} class="text-indigo-600">
                  {fmt.label}
                </option>
              ))}
            </select>
          </div>
          
          {exampleText && (
            <div>
              <label class="block text-sm font-medium mb-2">
                Example:
              </label>
              <div class="p-3 bg-white/20 rounded-md font-mono text-sm">
                {exampleText}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }