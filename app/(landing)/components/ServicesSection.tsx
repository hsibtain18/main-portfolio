 
import { experienceData } from "@/app/constant/experienceData";
import ExperienceCard from "./ExperienceCard";
 
 
export default function ExperienceSection() {
  return (
    <section className="py-20 px-6 md:px-12 overflow-hidden max-w-7xl mx-auto" id="resume" >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-12">
          <ExperienceCard
            {...experienceData[0]}
            duration={`${experienceData[0].startDate} – ${experienceData[0].endDate}`}
            direction="left"
            techStack={experienceData[0].techStack}
          />
          <ExperienceCard
            {...experienceData[1]}
            duration={`${experienceData[1].startDate} – ${experienceData[1].endDate}`}
            direction="left"
            techStack={experienceData[1].techStack}

          />
        </div>
          <div className="space-y-12">
          <ExperienceCard
            {...experienceData[2]}
            duration={`${experienceData[2].startDate} – ${experienceData[2].endDate}`}
            techStack={experienceData[2].techStack}
            direction="left"
          />
          <ExperienceCard
            {...experienceData[3]}
            duration={`${experienceData[3].startDate} – ${experienceData[3].endDate}`}
            techStack={experienceData[3].techStack}
            direction="left"

          />
        </div>
        
      </div>
    </section>
  );
}