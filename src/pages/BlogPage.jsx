import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, User } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import {
  blogCategories,
  blogPosts,
  getFeaturedPost,
  getHubTopics,
  getSortedPosts,
} from "../data/blog";

function SectionIntro({ label, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <ScrollReveal as="p" variant="subtle" className="text-sm font-semibold text-brand-blue">
        {label}
      </ScrollReveal>
      <ScrollReveal as="h2" variant="heading" delay={80} className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
        {title}
      </ScrollReveal>
      {description && (
        <ScrollReveal as="p" variant="subtle" delay={160} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </ScrollReveal>
      )}
    </div>
  );
}

function BlogMeta({ post, compact = false }) {
  return (
    <p className={`blog-card-meta ${compact ? "blog-card-meta--compact" : ""}`}>
      <span className="blog-card-category">{post.category}</span>
      {" · "}
      {post.date}
      {!compact && (
        <>
          {" · "}
          <span className="blog-card-read">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readTime}
          </span>
        </>
      )}
    </p>
  );
}

function BlogTags({ tags }) {
  if (!tags?.length) return null;
  return (
    <ul className="blog-tags">
      {tags.map((tag) => (
        <li key={tag} className="blog-tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function BlogCard({ post, featured = false }) {
  return (
    <article className={`blog-card group ${featured ? "blog-card--featured" : ""}`}>
      <a href={`#${post.id}`} className="blog-card-link-wrap">
        <div className="blog-card-media">
          <img
            src={post.image}
            alt={post.title}
            className={`h-full w-full ${post.imageClass ?? "object-cover object-center"}`}
            loading="lazy"
          />
          {featured && <span className="blog-card-badge">Featured</span>}
        </div>

        <div className="blog-card-body">
          <BlogMeta post={post} compact={!featured} />
          <h3 className="blog-card-title">{post.title}</h3>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <BlogTags tags={post.tags} />
          <div className="blog-card-footer">
            <span className="blog-card-author">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {post.author}
            </span>
            <span className="blog-card-link">
              Read more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featuredPost = getFeaturedPost();

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") {
      return getSortedPosts(blogPosts.filter((post) => post.id !== featuredPost.id));
    }
    return getSortedPosts(blogPosts.filter((post) => post.category === activeCategory));
  }, [activeCategory, featuredPost.id]);

  const hubTopics = getHubTopics();

  return (
    <>
      <Header />
      <main className="blog-page">
        <section className="blog-page-hero bg-blue-50 pt-32 pb-14 sm:pt-40 sm:pb-16">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <ScrollReveal as="p" variant="subtle" className="text-sm font-semibold text-brand-blue">
              Future-Link Hub
            </ScrollReveal>
            <ScrollReveal as="h1" variant="heading" delay={80} className="services-heading mt-3">
              Stories. Insights.{" "}
              <span className="hero-headline-highlight">Community.</span>
            </ScrollReveal>
            <ScrollReveal
              as="p"
              variant="subtle"
              delay={160}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Your hub for event guides, skills training stories, business tips, and community
              impact from Future-Link Services across Ghana.
            </ScrollReveal>
            <ScrollReveal delay={240} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#all-posts" className="hero-cta hero-cta-primary">
                <span>Browse All Posts</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
              <a href="#hub-topics" className="hero-cta hero-cta-secondary">
                <span>Explore the Hub</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <section id="hub-topics" className="border-t border-blue-100 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <SectionIntro
              label="The Hub"
              title="Everything in one place"
              description="Jump between events, services, impact stories, and blog articles — built for Ghana's workforce and event community."
            />
            <div className="blog-hub-grid mt-10">
              {hubTopics.map((topic, index) => (
                <ScrollReveal key={topic.label} delay={100 + index * 70} className="h-full">
                  <a href={topic.href} className="blog-hub-card group">
                    <span className="blog-hub-count">{topic.count}</span>
                    <h3 className="blog-hub-title">{topic.label}</h3>
                    <p className="blog-hub-copy">{topic.description}</p>
                    <span className="blog-hub-link">
                      Explore
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {featuredPost && (
          <section className="border-t border-blue-100 bg-blue-50 py-14 sm:py-16">
            <div className="mx-auto max-w-6xl px-5">
              <SectionIntro
                label="Featured"
                title="Latest from the hub"
                description="Our most timely article — updated guides and stories from the Future-Link team."
              />
              <ScrollReveal delay={120} className="mt-10">
                <BlogCard post={featuredPost} featured />
              </ScrollReveal>
            </div>
          </section>
        )}

        <section id="all-posts" className="border-t border-blue-100 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <SectionIntro
              label="Blog"
              title="All articles"
              description="Filter by topic to find event guides, skills stories, business advice, and community updates."
            />

            <ScrollReveal delay={100} className="blog-filter mt-10">
              {blogCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`blog-filter-btn ${activeCategory === category ? "blog-filter-btn--active" : ""}`}
                >
                  {category}
                </button>
              ))}
            </ScrollReveal>

            <div className="blog-grid mt-10">
              {filteredPosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={80 + index * 45} className="h-full">
                  <BlogCard post={post} />
                </ScrollReveal>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <p className="mt-10 text-center text-sm text-slate-500">No posts in this category yet.</p>
            )}
          </div>
        </section>

        <section className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <ScrollReveal as="h2" variant="heading" className="text-2xl font-bold text-navy sm:text-3xl">
              Want to contribute or partner?
            </ScrollReveal>
            <ScrollReveal as="p" variant="subtle" delay={100} className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              Future-Link is a hub for events, skills, business support, and community work.
              Share your story or ask about collaboration.
            </ScrollReveal>
            <ScrollReveal delay={180} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#services" className="hero-cta hero-cta-primary inline-flex">
                <span>Our Services</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
              <a href="#events" className="hero-cta hero-cta-secondary inline-flex">
                <span>View Events</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
