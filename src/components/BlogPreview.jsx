import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { blogPosts, getFeaturedPost, getSortedPosts } from "../data/blog";

function BlogPreviewCard({ post }) {
  return (
    <article className="blog-card group h-full">
      <a href={`#${post.id}`} className="blog-card-link-wrap">
        <div className="blog-card-media blog-card-media--compact">
          <img
            src={post.image}
            alt={post.title}
            className={`h-full w-full ${post.imageClass ?? "object-cover object-center"}`}
            loading="lazy"
          />
        </div>
        <div className="blog-card-body">
          <p className="blog-card-meta blog-card-meta--compact">
            <span className="blog-card-category">{post.category}</span>
            {" · "}
            {post.date}
          </p>
          <h3 className="blog-card-title">{post.title}</h3>
          <p className="blog-card-excerpt line-clamp-3">{post.excerpt}</p>
          <span className="blog-card-link mt-4 inline-flex">
            Read more
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </a>
    </article>
  );
}

export default function BlogPreview() {
  const featured = getFeaturedPost();
  const recent = getSortedPosts(blogPosts.filter((post) => post.id !== featured.id)).slice(0, 2);

  return (
    <section id="blog-preview" className="border-t border-blue-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal as="p" className="text-sm font-semibold text-brand-blue">
            Future-Link Hub
          </ScrollReveal>
          <ScrollReveal as="h2" delay={100} className="services-heading mt-3">
            Stories. Insights.{" "}
            <span className="hero-headline-highlight">Community.</span>
          </ScrollReveal>
          <ScrollReveal
            as="p"
            delay={200}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600"
          >
            Guides, training stories, and event intelligence from across the Future-Link hub.
          </ScrollReveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <ScrollReveal delay={120} className="h-full lg:col-span-2">
            <BlogPreviewCard post={featured} />
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
            {recent.map((post, index) => (
              <ScrollReveal key={post.id} delay={180 + index * 60} className="h-full">
                <BlogPreviewCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={400} className="mt-12 text-center">
          <a href="#blog" className="hero-cta hero-cta-primary inline-flex">
            <span>Visit the Hub</span>
            <span className="hero-cta-icon" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
