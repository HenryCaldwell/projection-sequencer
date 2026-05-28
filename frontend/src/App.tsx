import CrtEffect from "./components/sequencer/CrtEffect";
import Grid from "./components/sequencer/Grid";

function App() {
  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden bg-neutral-950">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <CrtEffect />
          <Grid />
        </div>

        <div className="h-56 shrink-0 flex flex-row overflow-x-auto overflow-y-hidden border-t border-white/5" />
      </div>

      <div className="w-52 shrink-0 flex flex-col overflow-hidden border-l border-white/5" />
    </div>
  );
}

export default App;
