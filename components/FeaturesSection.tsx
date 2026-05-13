"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  FileText,
  Code2,
  BarChart3,
  UserCheck,
  Share2,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "GitHub Activity Roast",
    description:
      "Your contribution graph, commit consistency, and repo quality — all under the microscope.",
    color: "var(--accent-cyan)",
  },
  {
    icon: FileText,
    title: "README Analysis",
    description:
      "Badge-to-content ratio, broken screenshots, and buzzword counting. We see everything.",
    color: "var(--accent-purple)",
  },
  {
    icon: Code2,
    title: "Project Portfolio Review",
    description:
      "Tutorial clones, missing deployments, and the classic weather app. We detect them all.",
    color: "var(--accent-pink)",
  },
  {
    icon: BarChart3,
    title: "Hireability Score",
    description:
      "A brutally honest number that tells you where you stand. No sugarcoating.",
    color: "var(--roast-brutal)",
  },
  {
    icon: UserCheck,
    title: "Developer Archetype",
    description:
      "Tutorial Warrior? Framework Collector? StackOverflow Survivor? Find out what you are.",
    color: "var(--accent-lime)",
  },
  {
    icon: Share2,
    title: "Viral Share Cards",
    description:
      "Beautiful, screenshot-worthy roast cards optimized for Twitter, LinkedIn, and Instagram.",
    color: "var(--roast-medium)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className="section" style={{ paddingBottom: "var(--section-gap)" }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
      >
        <span className="section-label">Features</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "1rem" }}>
          Everything you need.{" "}
          <span style={{ color: "var(--text-muted)" }}>Nothing you don&apos;t.</span>
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              className="card-matte hover-glow"
              style={{
                padding: "2rem",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                  marginBottom: "1.25rem",
                }}
              >
                <Icon size={22} style={{ color: feature.color }} />
              </div>

              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                  color: "var(--text-primary)",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
