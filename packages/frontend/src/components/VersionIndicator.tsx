import { Show } from 'solid-js';

const VersionIndicator = () => {
  const isSelfHosted = import.meta.env.VITE_HYPER_TERN_SELFHOSTED === 'true';
  const version = __HYPER_TERN_VERSION__;

  return (
    <Show when={isSelfHosted && version}>
      <div class="version-indicator" aria-label={`Version ${version}`}>
        <span>v{version}</span>
      </div>
    </Show>
  );
};

export default VersionIndicator;
