import StageNode from './StageNode';
import { PIPELINE_STAGES } from '../../data/pipelineStages';

export default function PipelineTrack({ stages, selectedStageId, onSelectStage }) {
  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex items-center min-w-max">
        {PIPELINE_STAGES.map((stage, idx) => {
          const stageState = stages[stage.id];
          const nextStage = PIPELINE_STAGES[idx + 1];
          const lineActive = stageState.status === 'SUCCESS';
          return (
            <div key={stage.id} className="flex items-center">
              <StageNode
                stage={stage}
                status={stageState.status}
                durationMs={stageState.durationMs}
                isSelected={selectedStageId === stage.id}
                onClick={() => onSelectStage(stage.id)}
              />
              {nextStage && (
                <div
                  className={`h-0.5 w-8 md:w-12 mx-0.5 transition-colors duration-500 ${
                    lineActive ? 'bg-cyberEmerald-500/60' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}