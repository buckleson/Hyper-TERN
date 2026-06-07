import { createSignal, For, Show, type Component } from 'solid-js';
import { PROVIDERS } from '../services/providers.js';
import { providerIcon } from './ProviderIcon.js';

interface ModelSelectDropdownProps {
  selectedValue: string | null;
  onSelect: (cliValue: string, displayLabel: string) => void;
}

function computeCliValue(modelName: string, provider: string): string {
  const providerId = provider.toLowerCase();
  return modelName.startsWith(`${providerId}/`) ? modelName : `${providerId}/${modelName}`;
}

type PickerModel = { label: string; value: string };
type PickerProvider = { id: string; name: string; models: PickerModel[] };

const MODEL_PICKER_DEFAULTS: Record<string, PickerModel[]> = {
  anthropic: [
    { label: 'Claude Sonnet 4.5', value: 'claude-sonnet-4.5' },
    { label: 'Claude Opus 4.1', value: 'claude-opus-4.1' },
    { label: 'Claude Haiku 4.5', value: 'claude-haiku-4.5' },
  ],
  deepseek: [
    { label: 'DeepSeek V3.2', value: 'deepseek-v3.2' },
    { label: 'DeepSeek R1', value: 'deepseek-r1' },
  ],
  gemini: [
    { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
    { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  ],
  openrouter: [
    { label: 'Auto', value: 'openrouter/auto' },
    { label: 'glm-5', value: 'z-ai/glm-5' },
  ],
};

const MODEL_PICKER_PROVIDER_ORDER = ['openai', 'anthropic', 'gemini', 'openrouter', 'deepseek'];

function modelPickerProviders(): PickerProvider[] {
  return MODEL_PICKER_PROVIDER_ORDER.flatMap((id) => {
    const provider = PROVIDERS.find((candidate) => candidate.id === id);
    if (!provider) return [];

    const fallbackModels = MODEL_PICKER_DEFAULTS[id] ?? [];
    const models = provider.models.length > 0 ? provider.models : fallbackModels;
    if (models.length === 0) return [];

    return [{ id: provider.id, name: provider.name, models }];
  });
}

function labelForModel(name: string): string {
  for (const provider of modelPickerProviders()) {
    for (const model of provider.models) {
      if (model.value === name) return model.label;
    }
  }

  const slash = name.indexOf('/');
  if (slash !== -1) {
    const bare = name.substring(slash + 1);
    for (const provider of modelPickerProviders()) {
      for (const model of provider.models) {
        if (model.value === bare) return model.label;
      }
    }
    return bare;
  }

  return name;
}

const ModelSelectDropdown: Component<ModelSelectDropdownProps> = (props) => {
  const [search, setSearch] = createSignal('');
  const [open, setOpen] = createSignal(true);

  const groupedModels = () => {
    const query = search().toLowerCase().trim();
    type GroupModel = { value: string; label: string; cliValue: string };
    const groups: { provId: string; name: string; models: GroupModel[] }[] = [];

    for (const provider of modelPickerProviders()) {
      const models = provider.models.map((model) => ({
        value: model.value,
        label: model.label,
        cliValue: computeCliValue(model.value, provider.id),
      }));

      const filtered = query
        ? provider.name.toLowerCase().includes(query)
          ? models
          : models.filter(
              (model) =>
                model.label.toLowerCase().includes(query) ||
                model.value.toLowerCase().includes(query),
            )
        : models;

      if (filtered.length > 0) {
        groups.push({ provId: provider.id, name: provider.name, models: filtered });
      }
    }

    return groups;
  };

  const handleSelect = (cliValue: string, label: string) => {
    props.onSelect(cliValue, label);
    setOpen(false);
    setSearch('');
  };

  const handleReopen = () => {
    setOpen(true);
    setSearch('');
  };

  return (
    <div class="routing-modal__inline-picker">
      <Show when={!open() && props.selectedValue}>
        <button
          class="routing-modal__selected-display"
          onClick={handleReopen}
          type="button"
          aria-label="Change model selection"
        >
          <span class="routing-modal__selected-label">
            {labelForModel(props.selectedValue!.split('/').pop()!)}
          </span>
          <span class="routing-modal__selected-hint">Click to change</span>
        </button>
      </Show>

      <Show when={open()}>
        <div class="routing-modal__search-wrap" style="padding: 0;">
          <svg
            class="routing-modal__search-icon"
            style="left: 14px;"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={(el) => requestAnimationFrame(() => el.focus())}
            class="routing-modal__search"
            type="text"
            placeholder="Search models or providers..."
            aria-label="Search models"
            value={search()}
            onInput={(event) => setSearch(event.currentTarget.value)}
          />
        </div>

        <div class="routing-modal__list">
          <For each={groupedModels()}>
            {(group) => (
              <div class="routing-modal__group">
                <div class="routing-modal__group-header">
                  <span class="routing-modal__group-icon">{providerIcon(group.provId, 16)}</span>
                  <span class="routing-modal__group-name">{group.name}</span>
                </div>
                <For each={group.models}>
                  {(model) => (
                    <button
                      class="routing-modal__model"
                      onClick={() => handleSelect(model.cliValue, model.label)}
                      type="button"
                    >
                      <span class="routing-modal__model-label">{model.label}</span>
                      <span class="routing-modal__model-id">{model.value}</span>
                    </button>
                  )}
                </For>
              </div>
            )}
          </For>
          <Show when={groupedModels().length === 0}>
            <div class="routing-modal__empty">No models match your search.</div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export { computeCliValue, labelForModel };
export default ModelSelectDropdown;
