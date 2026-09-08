'use client';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { projects } from '@/data/portfolio';
export function ExperienceViewer({
  projectId,
  onClose,
  onBrowse,
}: {
  projectId: string | null;
  onClose: () => void;
  onBrowse: (id: string) => void;
}) {
  const project = projectId ? projects[projectId] : undefined;
  return (
    <Dialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="project-dialog"
        showCloseButton
        finalFocus={() => document.getElementById('command-input')}
      >
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`project-experience project-${project.id}`}
          >
            <p className="eyebrow">
              ~/PROJECTS/{project.id.toUpperCase()}{' '}
              <span>/ PROJECT EXPERIENCE</span>
            </p>
            <p className="project-category">{project.category}</p>
            <DialogTitle className="project-name">
              {project.name}
              <span>.</span>
            </DialogTitle>
            <DialogDescription className="project-description">
              {project.description}
            </DialogDescription>
            <div className="project-body">
              <div>
                <p className="project-overview">{project.overview}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              {project.metric && (
                <div className="project-metric">
                  <strong>{project.metric}</strong>
                  <span>{project.metricLabel}</span>
                  <small>BUILT. SHIPPED. USED.</small>
                </div>
              )}
            </div>
            <div className="project-features">
              {project.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.1 }}
                >
                  <span>0{index + 1}</span>
                  <p>{feature}</p>
                  <span aria-hidden="true">↗</span>
                </motion.div>
              ))}
            </div>
            <div className="project-bottom">
              <button
                onClick={() => {
                  onBrowse(project.id);
                  onClose();
                }}
              >
                ▸ EXPLORE PROJECT FILES
              </button>
              <button onClick={onClose}>← RETURN TO TERMINAL</button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
