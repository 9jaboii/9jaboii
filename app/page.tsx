import Image from "next/image";
import sampleBank from "@/bank/sample-questions.json";
import { SampleQuestion } from "./sample-question";

export default function HomePage() {
  const sample = sampleBank.items[0];

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <Image src="/brand/ccarchprep-logo.svg" width={360} height={90} alt="CCArchPrep" priority />
        <a href="#sample">Try a sample</a>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">The unofficial CCAR-P practice platform</p>
          <h1>Think like an architect. <em>Prepare with intent.</em></h1>
          <p className="lede">Original practice scenarios with rationales that explain the decision—and every tempting wrong turn.</p>
          <a className="button" href="#sample">Try a sample question</a>
          <p className="trust">Original scenarios · Every option explained · Independent and unofficial</p>
        </div>
        <aside className="proof" aria-label="Product highlights">
          <strong>What makes this different?</strong>
          <p>Every distractor is tagged with the reasoning pattern it exploits, so review can address judgment—not just topic recall.</p>
          <dl>
            <div><dt>Annual access</dt><dd>$59</dd></div>
            <div><dt>Free practice</dt><dd>5/day</dd></div>
          </dl>
        </aside>
      </section>

      <section className="sample-section" id="sample" aria-labelledby="sample-title">
        <header>
          <p className="eyebrow">No signup required</p>
          <h2 id="sample-title">Try the rationale experience</h2>
          <p>Choose the best architectural decision under the stated constraint.</p>
        </header>
        <SampleQuestion item={sample} />
      </section>

      <footer>
        <p>CCArchPrep is independent and is not affiliated with or endorsed by Anthropic. Claude and Anthropic are trademarks of their respective owner.</p>
      </footer>
    </main>
  );
}
