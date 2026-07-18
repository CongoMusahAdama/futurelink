import { ArrowLeft, ArrowRight, Clock, User } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { getPostById, getSortedPosts } from "../data/blog";

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

function RelatedCard({ post }) {
  return (
    <a href={`#${post.id}`} className="blog-related-card group">
      <div className="blog-related-media">
        <img
          src={post.image}
          alt=""
          className={`h-full w-full ${post.imageClass ?? "object-cover object-center"}`}
          loading="lazy"
        />
      </div>
      <div className="blog-related-body">
        <p className="blog-related-meta">
          <span>{post.category}</span> · {post.date}
        </p>
        <h3 className="blog-related-title">{post.title}</h3>
        <span className="blog-related-link">
          Read article
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  );
}

export default function BlogPostPage({ postId }) {
  const post = getPostById(postId);

  if (!post) {
    return (
      <>
        <Header />
        <main className="blog-post-page">
          <div className="mx-auto max-w-2xl px-5 py-32 text-center">
            <h1 className="text-2xl font-bold text-navy">Article not found</h1>
            <p className="mt-4 text-slate-600">This hub article may have moved or no longer exists.</p>
            <a href="#blog" className="hero-cta hero-cta-primary mt-8 inline-flex">
              <span>Back to Hub</span>
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = getSortedPosts()
    .filter((item) => item.id !== post.id && item.category === post.category)
    .slice(0, 2);

  if (related.length < 2) {
    const extras = getSortedPosts()
      .filter((item) => item.id !== post.id && !related.some((r) => r.id === item.id))
      .slice(0, 2 - related.length);
    related.push(...extras);
  }

  return (
    <>
      <Header />
      <main className="blog-post-page">
        <article className="blog-post-article">
          <header className="blog-post-header pt-32 pb-10 sm:pt-40 sm:pb-12">
            <div className="mx-auto max-w-3xl px-5">
              <ScrollReveal>
                <a href="#blog" className="blog-post-back">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to Hub
                </a>
              </ScrollReveal>

              <ScrollReveal delay={60} className="blog-post-meta mt-6">
                <span className="blog-post-category">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span className="blog-post-read">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.readTime}
                </span>
              </ScrollReveal>

              <ScrollReveal as="h1" variant="heading" delay={120} className="blog-post-title mt-4">
                {post.title}
              </ScrollReveal>

              <ScrollReveal delay={180} className="blog-post-author mt-5">
                <User className="h-4 w-4" aria-hidden="true" />
                {post.author}
              </ScrollReveal>

              <ScrollReveal delay={220} className="mt-5">
                <BlogTags tags={post.tags} />
              </ScrollReveal>
            </div>
          </header>

          <ScrollReveal delay={140} className="blog-post-featured-media mx-auto max-w-4xl px-5">
            <img
              src={post.image}
              alt={post.title}
              className={`blog-post-featured-image ${post.imageClass ?? "object-cover object-center"}`}
            />
          </ScrollReveal>

          <div className="mx-auto max-w-3xl px-5 py-10 sm:py-12">
            <ScrollReveal delay={180} className="blog-post-lead">
              {post.excerpt}
            </ScrollReveal>

            <ScrollReveal delay={220} className="blog-post-content">
              {post.content.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </ScrollReveal>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-slate-100 bg-slate-50 py-14 sm:py-16">
            <div className="mx-auto max-w-4xl px-5">
              <ScrollReveal as="h2" variant="heading" className="text-xl font-bold text-navy sm:text-2xl">
                More from the hub
              </ScrollReveal>
              <div className="blog-related-grid mt-8">
                {related.map((item, index) => (
                  <ScrollReveal key={item.id} delay={80 + index * 60}>
                    <RelatedCard post={item} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
