import { Component, type ErrorInfo, type ReactNode } from 'react';

// Minimal error boundary — catches render/commit errors anywhere below
// <App /> and renders an in-world apology screen with a reset hook. The
// puzzle state lives in Zustand, so wiping localStorage is the safest
// recovery path for a truly broken save.

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[grimhold] render crash', error, info.componentStack);
  }

  resetSave = () => {
    try {
      localStorage.removeItem('grimhold-save-v0');
    } catch {
      /* ignore storage errors */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grimhold-frame text-on-surface flex items-center justify-center p-6">
        <div className="chalk-panel rounded-md p-6 max-w-sm text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant/70">
            Grimhold cracked
          </p>
          <h2 className="font-headline italic text-2xl text-secondary mt-1">
            The stone lost its grip on the scene.
          </h2>
          <p className="font-body italic text-[12px] text-on-surface-variant mt-3 leading-relaxed">
            Something went wrong rendering this moment. Your progress is
            safe unless the save itself is corrupt. Try the reset below —
            it clears the local save and returns you to the title.
          </p>
          <pre className="text-left font-label text-[10px] text-outline mt-4 max-h-32 overflow-auto bg-surface-container-lowest rounded-sm p-2">
            {String(this.state.error.message || this.state.error)}
          </pre>
          <div className="space-y-2 mt-4">
            <button className="btn-descend w-full" onClick={() => window.location.reload()}>
              Reload
            </button>
            <button className="btn-ghost w-full" onClick={this.resetSave}>
              Reset the save + reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
