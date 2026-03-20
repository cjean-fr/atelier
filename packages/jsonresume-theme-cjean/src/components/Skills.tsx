import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import Section from "./Section.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface SkillsProps extends StandardAttributes {
  skills: Resume["skills"];
}

export default function Skills({ skills, ...props }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <Section name={t("skills")} {...props}>
      {skills.map((skill) => (
        <div className="mb-4 break-inside-avoid" key={skill.name}>
          <h3 className="text-lg font-bold">{skill.name}</h3>
          <ul className="my-3 flex flex-wrap gap-2 leading-8">
            {skill.keywords?.map((keyword) => (
              <li className="badge" key={keyword}>
                {keyword}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
