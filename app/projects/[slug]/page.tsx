import { notFound } from "next/navigation";
import { caseStudies, getCaseStudyBySlug } from "@/lib/projects";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import ScrollProgressNav from "@/components/case-study/ScrollProgressNav";
import CaseStudyStep from "@/components/case-study/CaseStudyStep";

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <CaseStudyHero caseStudy={caseStudy} />
      <div className="mx-auto flex w-full max-w-3xl gap-10 px-6 pb-24 lg:max-w-5xl">
        <ScrollProgressNav steps={caseStudy.steps} />
        <div className="min-w-0 flex-1">
          {caseStudy.steps.map((step) => (
            <CaseStudyStep key={step.type} step={step} />
          ))}
        </div>
      </div>
    </main>
  );
}
