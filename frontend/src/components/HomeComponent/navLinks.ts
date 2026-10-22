export type NavLink = {
  label: string;
  route: string;
  sectionId?: string | null;
};

// Centralized list of navigable tags used by Navbar and Search
export const navLinks: NavLink[] = [
  // About
  { label: "Profile of Cache", route: "/about/profile" },
  { label: "Leadership Team", route: "/about/leadership" },
  { label: "Our Alliances", route: "/about/alliances" },
  { label: "Awards & Certifications", route: "/about/awards" },

  // AI Ops Center of Excellence
  { label: "AI Ops CoE", route: "/ai-ops-coe" },
  { label: "AI Ops Overview", route: "/ai-ops-coe" },
  { label: "Innovations", route: "/ai-ops-coe", sectionId: "innovations" },

  // Search aliases (same page)
  { label: "Awards and Accolades", route: "/about/awards" },
  { label: "Certifications", route: "/about/awards" },

  // Products & Services
  { label: "Cybersecurity", route: "/cybersecurity" },
  { label: "Cyber Security", route: "/cybersecurity" },
  { label: "Cybersecurity Overview", route: "/cybersecurity" },
  { label: "Security Consulting", route: "/cybersecurity/security-consulting" },
  { label: "Infrastructure & Endpoint Security", route: "/cybersecurity/infrastructure-endpoint-security" },
  { label: "Threat Monitoring & Response", route: "/cybersecurity/threat-monitoring-response" },
  { label: "Vulnerability Management", route: "/cybersecurity/vulnerability-management" },
  { label: "Data & Cloud Security", route: "/cybersecurity/data-cloud-security" },
  { label: "Security Audits & Compliance", route: "/cybersecurity/security-audits-compliance" },
  { label: "Cloud Security", route: "/cloud/cloud-security" },
  { label: "Data Analytics & AI", route: "/aianddataservice" },
  { label: "Data AI", route: "/aianddataservice" },
  { label: "Data & AI Overview", route: "/aianddataservice" },
  { label: "Data Platforms", route: "/data-analytics/data-platforms" },
  { label: "Advanced Analytics", route: "/data-analytics/advanced-analytics" },
  { label: "AI Automation", route: "/data-analytics/ai-automation" },
  { label: "Intelligent CRM", route: "/data-analytics/intelligent-crm" },
  { label: "Data Security & Governance", route: "/data-analytics/data-security-governance" },
  { label: "Cloud", route: "/cloudservices" },
  { label: "Cloud Overview", route: "/cloudservices" },
  { label: "Cloud & Application Transformation", route: "/cloud/cloud-application-transformation" },
  { label: "Cloud Migration", route: "/cloud/cloud-application-transformation" },
  { label: "Cloud Migration & Rehosting", route: "/cloud/cloud-application-transformation" },
  { label: "Managed Cloud Services", route: "/cloud/managed-cloud-services" },
  { label: "Cloud Managed Services", route: "/cloud/managed-cloud-services" },
  { label: "NOC & SOC Command Center", route: "/cloud/managed-cloud-services" },
  { label: "App Modernization", route: "/cloud/cloud-application-transformation" },
  { label: "App Replatforming & Modernization", route: "/cloud/cloud-application-transformation" },
  { label: "Cloud Operations", route: "/cloud/managed-cloud-services" },
  { label: "Cloud Optimization & FinOps", route: "/cloud/managed-cloud-services" },
  { label: "Multi-Cloud Billing", route: "/cloud/multi-cloud-billing" },
  { label: "AI Center of Excellence", route: "/cloud/ai-coe" },
  { label: "Infra & Networking", route: "/infrastructureservice" },
  { label: "Infrastructure & Networking", route: "/infrastructureservice" },
  { label: "Infrastructure Overview", route: "/infrastructureservice" },
  { label: "IT Infrastructure Solutions", route: "/infrastructure/it-infrastructure-solutions" },
  { label: "Data Center Management", route: "/infrastructure/data-center-management" },
  { label: "Network Infrastructure (LAN/WAN/Wireless)", route: "/infrastructure/network-infrastructure" },
  { label: "Server & Storage Management", route: "/infrastructure/server-storage-management" },
  { label: "Virtualization & Hypervisor Management", route: "/infrastructure/virtualization-hypervisor-management" },
  { label: "Backup & Disaster Recovery", route: "/infrastructure/backup-disaster-recovery" },
  { label: "Infrastructure Consulting", route: "/infrastructure/infrastructure-consulting" },
  { label: "Infrastructure Design", route: "/infrastructure/infrastructure-design" },
  { label: "Infrastructure Deployment", route: "/infrastructure/infrastructure-deployment" },
  { label: "Infrastructure Management", route: "/infrastructure/infrastructure-management" },
  { label: "Data Center Migration", route: "/infrastructure/data-center-migration" },
  { label: "Managed Services", route: "/manageservices" },
  { label: "Managed Services Overview", route: "/manageservices" },
  { label: "Network Managed Services", route: "/managed-services/network-managed-services" },
  { label: "IT Infrastructure Managed Services", route: "/managed-services/it-infrastructure-management" },
  { label: "Cloud Managed Services", route: "/managed-services/cloud-managed-services" },
  { label: "Security Operations (SOC / SIEM / MDR)", route: "/managed-services/security-operations-soc-siem-mdr" },
  { label: "DevOps & Automation Services", route: "/managed-services/devops-automation-services" },
  { label: "End-User & Workplace Services", route: "/managed-services/end-user-workplace-support" },
  { label: "End-User & Workplace Support", route: "/managed-services/end-user-workplace-support" },
  { label: "Consulting & Auditing", route: "/consultingservice" },
  { label: "Consulting Overview", route: "/consultingservice" },
  { label: "Strategy Consulting", route: "/consulting/strategy-consulting" },
  { label: "Infrastructure Advisory", route: "/consulting/infrastructure-advisory" },
  { label: "Risk & Compliance", route: "/consulting/risk-compliance" },
  { label: "IT Audits", route: "/consulting/it-audits" },
  { label: "Process Optimization", route: "/consulting/process-optimization" },
  { label: "Security Consulting", route: "/cybersecurity/security-consulting" },
  { label: "GRC", route: "/grc-dashboard" },

  // Insights
  { label: "Leadership Vision", route: "/insights", sectionId: "LeadershipVision" },
  { label: "Blogs", route: "/blogs" },
  { label: "Case Studies", route: "/case-studies" },
  { label: "Problems & Diagnostics", route: "/insights", sectionId: "problems_and_diagnostics" },
  // { label: "Events & Social Activities", route: "/insights", sectionId: "events" },

  // Industries (case studies by industry)
  { label: "Telecom", route: "/case-studies?industry=Telecom" },
  { label: "BFSI", route: "/case-studies?industry=BFSI" },
  { label: "Automobile & Manufacturing", route: "/case-studies?industry=Automobile%20%26%20Manufacturing" },
  { label: "Retail", route: "/case-studies?industry=Retail" },
  { label: "Healthcare & Hospitality", route: "/case-studies?industry=Healthcare%20%26%20Hospitality" },
  { label: "Governance", route: "/case-studies?industry=Governance" },
  { label: "IT & ITES", route: "/case-studies?industry=IT%20%26%20ITES" },

  // Contact
  { label: "Contact Us", route: "/contactus" },
];