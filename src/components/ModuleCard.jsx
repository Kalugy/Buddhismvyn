import { CheckCircle, ChevronRight } from "lucide-react";

export default function ModuleCard({ module, isComplete, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl shadow-lg"
    >
      <div className={`bg-gradient-to-br ${module.color} p-6 min-h-[180px] flex flex-col justify-between`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Module {module.id}
              </span>
              {isComplete && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Completed
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white">{module.title}</h3>
            <p className="text-white/80 text-sm mt-0.5">{module.subtitle}</p>
          </div>
          <div className="text-4xl ml-4 flex-shrink-0">{module.icon}</div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-white/70 text-sm line-clamp-2 flex-1">{module.description}</p>
          <div className="ml-4 flex-shrink-0">
            {isComplete ? (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
