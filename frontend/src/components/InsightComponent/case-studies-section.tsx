import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, TrendingUp, Clock, Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTarget } from "../../hooks/usePageScroll";

// Define types for case study data
interface CaseStudyResults {
  efficiency: string;
  cost: string;
  uptime: string;
}

interface CaseStudy {
  id: number;
  title: string;
  industry: string;
  challenge: string;
  results: CaseStudyResults;
  image: string;
  duration: string;
}

interface DetailedData {
  [title: string]: {
    challenge?: string;
    solution?: string;
    results?: string[];
  };
}

const caseStudies = [
  // Telecom Case Studies
  {
    id: 1,
    title: "Data Security and Device Vulnerabilities",
    industry: "Telecom",
    challenge: "Telecom companies were facing risks of data breaches and unauthorized access due to unsecured laptops and printers used across offices and field operations.",
    results: {
      efficiency: "Endpoint security implemented",
      cost: "Data breach risks mitigated",
      uptime: "Sensitive telecom data protected"
    },
    image: "/casestudies/telecomdatasecurity.webp",
    duration: "Secure laptops and printers deployment"
  },
  {
    id: 2,
    title: "Inefficient Network and Hardware Management",
    industry: "Telecom",
    challenge: "Managing multiple hardware devices like servers, cables, OpenGear devices, and IG cards across telecom networks was complex, leading to downtime, slow performance, and operational inefficiencies.",
    results: {
      efficiency: "Network reliability improved",
      cost: "Operational efficiency enhanced",
      uptime: "Robust infrastructure deployed"
    },
    image: "/casestudies/telecom2.webp",
    duration: "Standardized servers, OpenGear, cables, IG cards, and ROCK devices"
  },
  {
    id: 3,
    title: "Lack of Standardization Across Devices and Locations",
    industry: "Telecom",
    challenge: "Telecom operations across multiple sites often suffered from inconsistent hardware and device setups, complicating maintenance, support, and operational control.",
    results: {
      efficiency: "Streamlined IT management",
      cost: "Consistent performance achieved",
      uptime: "Easier maintenance across locations"
    },
    image: "/casestudies/telelcom3.webp",
    duration: "Uniform deployment of commercial devices and network hardware"
  },

  // BFSI Case Studies
  {
    id: 4,
    title: "Legacy and Unscalable Infrastructure Modernization",
    industry: "BFSI",
    challenge: "Financial institutions were struggling with outdated systems that could not scale with growing digital demands and customer transactions.",
    results: {
      efficiency: "Modern scalable infrastructure deployed",
      cost: "Improved performance for digital transactions",
      uptime: "Support for future growth enabled"
    },
    image: "/casestudies/bfsi1.webp",
    duration: "Over 1000 network devices implemented"
  },
  {
    id: 5,
    title: "Network Security Risk Mitigation",
    industry: "BFSI",
    challenge: "BFSI clients faced cybersecurity threats and compliance challenges due to old firewalls and limited network visibility, exposing them to financial and reputational risks.",
    results: {
      efficiency: "Real-time network monitoring enabled",
      cost: "Advanced threat detection implemented",
      uptime: "Industry compliance achieved"
    },
    image: "/casestudies/bfsi2.webp",
    duration: "Enhanced network visibility"
  },
  {
    id: 6,
    title: "Operational Efficiency Enhancement",
    industry: "BFSI",
    challenge: "Institutions were dealing with manual configurations, frequent downtime, and fragmented hardware setups, which slowed operations and degraded customer experience.",
    results: {
      efficiency: "Reduced operational downtime",
      cost: "Streamlined IT management",
      uptime: "Improved customer experience"
    },
    image: "/casestudies/bfsi3.webp",
    duration: "Standardized enterprise infrastructure"
  },

  // Automobile & Manufacturing Case Studies
  {
    id: 7,
    title: "Cloud Cost Optimization & FinOps Implementation",
    industry: "Automobile & Manufacturing",
    challenge: "Organizations in the automobile sector were facing uncontrolled cloud spending and lacked visibility into resource utilization, leading to high operational costs without proportional business value.",
    results: {
      efficiency: "Cost transparency achieved",
      cost: "Budget control implemented",
      uptime: "Maximum ROI from cloud investments"
    },
    image: "/casestudies/auto1.webp",
    duration: "Resource efficiency optimized"
  },
  {
    id: 8,
    title: "Hybrid Infrastructure Management",
    industry: "Automobile & Manufacturing",
    challenge: "Managing both on-prem OEM devices (laptops, desktops) and cloud services created operational complexity. The absence of centralized control increased downtime risks and slowed digital adoption.",
    results: {
      efficiency: "Unified IT environment created",
      cost: "Reduced operational downtime",
      uptime: "Simplified IT operations"
    },
    image: "/casestudies/auto2.webp",
    duration: "Integrated cloud and on-premise solutions"
  },
  {
    id: 9,
    title: "Future-Ready Architecture Implementation",
    industry: "Automobile & Manufacturing",
    challenge: "Automobile enterprises were struggling with IT setups that were not aligned with future demands of the industry (connected services, digital supply chain, remote workforce). Legacy infrastructure limited scalability and flexibility.",
    results: {
      efficiency: "Scalable digital foundation established",
      cost: "Future-ready architecture implemented",
      uptime: "Enhanced innovation capabilities"
    },
    image: "/casestudies/auto3.webp",
    duration: "Improved growth potential"
  },

  // Retail Case Studies
  {
    id: 10,
    title: "Data Security on End-User Devices",
    industry: "Retail",
    challenge: "Retail organizations were facing risks of data breaches and unauthorized access on laptops and desktops used by employees and store staff.",
    results: {
      efficiency: "Endpoint security implemented",
      cost: "Data breach risks mitigated",
      uptime: "Secure customer data protection"
    },
    image: "/casestudies/retail1.webp",
    duration: "Secured solutions for laptops and desktops"
  },
  {
    id: 11,
    title: "Hardware Vulnerabilities and Inefficiency",
    industry: "Retail",
    challenge: "Outdated or unprotected laptops and desktops led to frequent system crashes, slow performance, and potential malware attacks, affecting business operations.",
    results: {
      efficiency: "System reliability improved",
      cost: "Performance optimization achieved",
      uptime: "Operational continuity maintained"
    },
    image: "/casestudies/retail2.webp",
    duration: "Secured laptops and desktops deployment"
  },
  {
    id: 12,
    title: "Lack of Standardized IT Equipment Across Stores",
    industry: "Retail",
    challenge: "Retail chains often struggled with inconsistent hardware and security setups across multiple outlets, making IT management and compliance difficult.",
    results: {
      efficiency: "Uniform security policies implemented",
      cost: "Simplified IT management achieved",
      uptime: "Consistent operational efficiency"
    },
    image: "/casestudies/retail3.webp",
    duration: "Standardized secured devices across locations"
  },

  // Healthcare & Hospitality Case Studies
  {
    id: 13,
    title: "Healthcare Cloud Cost Management",
    industry: "Healthcare & Hospitality",
    challenge: "Enterprises in healthcare and hospitality were facing rising cloud bills due to lack of proper monitoring and resource governance. Teams had little visibility into how cloud resources were being consumed across departments.",
    results: {
      efficiency: "Cost transparency achieved",
      cost: "Real-time monitoring implemented",
      uptime: "Optimization strategies deployed"
    },
    image: "/casestudies/healthcare1.webp",
    duration: "Maximized efficiency and cost control"
  },
  {
    id: 14,
    title: "Compliance and Budgeting Solutions",
    industry: "Healthcare & Hospitality",
    challenge: "Healthcare and hospitality organizations operate in highly regulated environments where compliance, budgeting, and financial accountability are critical. Untracked cloud expenses created risks of audit issues and budget overruns.",
    results: {
      efficiency: "Automated reporting implemented",
      cost: "Cost allocation established",
      uptime: "Compliance-driven tracking enabled"
    },
    image: "/casestudies/healthcare2.webp",
    duration: "Financial governance aligned with regulations"
  },
  {
    id: 15,
    title: "Resource Utilization Optimization",
    industry: "Healthcare & Hospitality",
    challenge: "Many organizations were overprovisioning cloud resources, leading to waste. Idle workloads and underutilized infrastructure increased costs without contributing to service improvements.",
    results: {
      efficiency: "Idle resources identified",
      cost: "Workloads rightsized",
      uptime: "Auto-scaling mechanisms implemented"
    },
    image: "/casestudies/healthcare3.webp",
    duration: "Significant cost savings with maintained performance"
  },

  // Governance Case Studies
  {
    id: 16,
    title: "Reliable Data Backup & Disaster Recovery",
    industry: "Governance",
    challenge: "Government institutions faced challenges in managing sensitive tender data, as existing systems lacked robust backup and recovery mechanisms. This posed risks of data loss, downtime, and compliance failures.",
    results: {
      efficiency: "Secure data storage implemented",
      cost: "Redundant backup systems deployed",
      uptime: "Critical operations protected"
    },
    image: "/casestudies/governance1.webp",
    duration: "CDAC-backed tender data backup system"
  },
  {
    id: 17,
    title: "Security Monitoring & Threat Detection",
    industry: "Governance",
    challenge: "Traditional setups had minimal visibility into security threats and were unable to process large volumes of event logs, leaving governance bodies vulnerable to cyberattacks and insider threats.",
    results: {
      efficiency: "Real-time log analysis enabled",
      cost: "Threat detection implemented",
      uptime: "Incident response capabilities"
    },
    image: "/casestudies/governance2.webp",
    duration: "SIEM tool with Microfocus 2000 EPS"
  },
  {
    id: 18,
    title: "Infrastructure Modernization & Upgrade",
    industry: "Governance",
    challenge: "Government departments struggled with aging routers, insufficient storage systems, and fragmented IT hardware, causing inefficiencies, slow performance, and frequent outages.",
    results: {
      efficiency: "Enterprise-grade infrastructure deployed",
      cost: "Performance optimization achieved",
      uptime: "Future-ready IT backbone"
    },
    image: "/casestudies/governance3.webp",
    duration: "Advanced storage and networking solutions"
  },

  // IT & ITES Case Studies
  {
    id: 19,
    title: "Hardware Maintenance & Support Services",
    industry: "IT & ITES",
    challenge: "Organizations struggled with aging laptops, desktops, and servers, leading to frequent hardware failures and disruptions in daily operations.",
    results: {
      efficiency: "Reliable operations ensured",
      cost: "Minimized downtime achieved",
      uptime: "Regular maintenance provided"
    },
    image: "/casestudies/ites1.webp",
    duration: "Server AMC and hardware support services"
  },
  {
    id: 20,
    title: "License Management & Compliance",
    industry: "IT & ITES",
    challenge: "IT/ITES companies faced risks due to expired software licenses, including non-compliance issues, potential fines, and interrupted access to critical applications.",
    results: {
      efficiency: "Software compliance maintained",
      cost: "Legal risks avoided",
      uptime: "Uninterrupted application access"
    },
    image: "/casestudies/ites2.webp",
    duration: "Managed license renewal services"
  },
  {
    id: 21,
    title: "Centralized IT Asset Management",
    industry: "IT & ITES",
    challenge: "Without a structured maintenance and renewal process, organizations were spending more on ad-hoc repairs and losing track of hardware lifecycle, reducing overall IT efficiency.",
    results: {
      efficiency: "Proactive maintenance implemented",
      cost: "Cost-efficient operations achieved",
      uptime: "Planned upgrades scheduled"
    },
    image: "/casestudies/ites3.webp",
    duration: "Comprehensive asset management approach"
  }
];

export function CaseStudiesSection() {
  const location = useLocation();
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  // Scroll to section when linked from industry pages or solutions
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const industryParam = urlParams.get('industry');
    const activeStudyParam = urlParams.get('activeStudy');

    if (!industryParam && !activeStudyParam) return;

    const timer = window.setTimeout(() => {
      const element = document.getElementById('success-stories');
      if (element) scrollToTarget(element, { offset: -80 });
    }, 300);

    const newUrl = new URL(window.location.href);
    if (industryParam) newUrl.searchParams.delete('industry');
    if (activeStudyParam) newUrl.searchParams.delete('activeStudy');
    window.history.replaceState({}, '', newUrl.pathname + (newUrl.search || ''));

    return () => window.clearTimeout(timer);
  }, [location.search]);

  const handleViewDetails = (study: CaseStudy) => {
    setSelectedStudy(study);
  };

  const closeModal = () => {
    setSelectedStudy(null);
  };

  // Function to get detailed content for modal
  const getDetailedContent = (title: string, section: string): string => {
    const detailedData: DetailedData = {
      "Data Security and Device Vulnerabilities": {
        challenge: "Telecom companies were facing risks of data breaches and unauthorized access due to unsecured laptops and printers used across offices and field operations.",
        solution: "Cache provided secure laptops and printers, implementing endpoint security and encryption, ensuring sensitive telecom data remained protected from cyber threats.",
        results: [
          "Endpoint security implemented",
          "Data breach risks mitigated",
          "Sensitive telecom data protected",
          "Encryption measures deployed"
        ]
      },
      "Inefficient Network and Hardware Management": {
        challenge: "Managing multiple hardware devices like servers, cables, OpenGear devices, and IG cards across telecom networks was complex, leading to downtime, slow performance, and operational inefficiencies.",
        solution: "Cache deployed and standardized servers, OpenGear, cables, IG cards, and ROCK devices, creating a robust and well-managed network infrastructure that improved reliability and efficiency.",
        results: [
          "Network reliability improved",
          "Operational efficiency enhanced",
          "Robust infrastructure deployed",
          "Standardized network management"
        ]
      },
      "Lack of Standardization Across Devices and Locations": {
        challenge: "Telecom operations across multiple sites often suffered from inconsistent hardware and device setups, complicating maintenance, support, and operational control.",
        solution: "Cache implemented uniform deployment of commercial devices, servers, and network hardware, enabling streamlined IT management, consistent performance, and easier maintenance across all locations.",
        results: [
          "Streamlined IT management",
          "Consistent performance achieved",
          "Easier maintenance across locations",
          "Uniform deployment standards"
        ]
      },
      "Legacy and Unscalable Infrastructure Modernization": {
        challenge: "Financial institutions were struggling with outdated systems that could not scale with growing digital demands and customer transactions.",
        solution: "Cache deployed over 1000 devices (switches, routers, firewalls), creating a modern, scalable infrastructure that improved performance and supported future growth.",
        results: [
          "Modern scalable infrastructure deployed",
          "Over 1000 network devices implemented",
          "Improved performance for digital transactions",
          "Support for future growth enabled"
        ]
      },
      "Data Security on End-User Devices": {
        challenge: "Retail organizations were facing risks of data breaches and unauthorized access on laptops and desktops used by employees and store staff.",
        solution: "Cache provided secured solutions for laptops and desktops, implementing endpoint security measures to protect sensitive customer and business data.",
        results: [
          "Endpoint security implemented",
          "Data breach risks mitigated",
          "Secure customer data protection",
          "Enhanced security measures deployed"
        ]
      },
      "Hardware Vulnerabilities and Inefficiency": {
        challenge: "Outdated or unprotected laptops and desktops led to frequent system crashes, slow performance, and potential malware attacks, affecting business operations.",
        solution: "Cache deployed secured laptops and desktops with proper configurations and security tools, improving system reliability, performance, and operational continuity.",
        results: [
          "System reliability improved",
          "Performance optimization achieved",
          "Operational continuity maintained",
          "Malware protection implemented"
        ]
      },
      "Lack of Standardized IT Equipment Across Stores": {
        challenge: "Retail chains often struggled with inconsistent hardware and security setups across multiple outlets, making IT management and compliance difficult.",
        solution: "Cache standardized the deployment of secured laptops and desktops, ensuring uniform security policies, simplified IT management, and consistent operational efficiency across all retail locations.",
        results: [
          "Uniform security policies implemented",
          "Simplified IT management achieved",
          "Consistent operational efficiency",
          "Standardized security across all locations"
        ]
      },
      "Network Security Risk Mitigation": {
        challenge: "BFSI clients faced cybersecurity threats and compliance challenges due to old firewalls and limited network visibility, exposing them to financial and reputational risks.",
        solution: "Cache implemented next-gen firewalls and secure routing, enabling real-time monitoring, advanced threat detection, and compliance with industry regulations.",
        results: [
          "Real-time network monitoring enabled",
          "Advanced threat detection implemented",
          "Industry compliance achieved",
          "Enhanced network visibility established"
        ]
      },
      "Operational Efficiency Enhancement": {
        challenge: "Institutions were dealing with manual configurations, frequent downtime, and fragmented hardware setups, which slowed operations and degraded customer experience.",
        solution: "Cache standardized the hardware infrastructure with enterprise-grade devices and provided deployment + managed services, reducing downtime, streamlining IT management, and improving overall efficiency.",
        results: [
          "Reduced operational downtime",
          "Streamlined IT management",
          "Improved customer experience",
          "Standardized enterprise infrastructure"
        ]
      },
      "Healthcare Cloud Cost Management": {
        challenge: "Enterprises in healthcare and hospitality were facing rising cloud bills due to lack of proper monitoring and resource governance. Teams had little visibility into how cloud resources were being consumed across departments.",
        solution: "Cache implemented FinOps services to provide cost transparency, real-time monitoring, and optimization strategies, ensuring organizations only pay for what they use while maximizing efficiency.",
        results: [
          "Cost transparency achieved",
          "Real-time monitoring implemented",
          "Optimization strategies deployed",
          "Maximized efficiency and cost control"
        ]
      },
      "Cloud Cost Optimization & FinOps Implementation": {
        challenge: "Organizations in the automobile sector were facing uncontrolled cloud spending and lacked visibility into resource utilization, leading to high operational costs without proportional business value.",
        solution: "Cache implemented FinOps services to monitor, analyze, and optimize cloud usage. This provided cost transparency, budget control, and resource efficiency, ensuring maximum ROI from cloud investments.",
        results: [
          "Cost transparency achieved",
          "Budget control implemented",
          "Resource efficiency optimized",
          "Maximum ROI from cloud investments"
        ]
      },
      "Hybrid Infrastructure Management": {
        challenge: "Managing both on-prem OEM devices (laptops, desktops) and cloud services created operational complexity. The absence of centralized control increased downtime risks and slowed digital adoption.",
        solution: "Cache offered Managed Cloud Services integrated with OEM solutions (VMware, Cisco, laptops, desktops). This created a unified IT environment, reduced downtime, and simplified day-to-day IT operations.",
        results: [
          "Unified IT environment created",
          "Reduced operational downtime",
          "Simplified IT operations",
          "Integrated cloud and on-premise solutions"
        ]
      },
      "Future-Ready Architecture Implementation": {
        challenge: "Automobile enterprises were struggling with IT setups that were not aligned with future demands of the industry (connected services, digital supply chain, remote workforce). Legacy infrastructure limited scalability and flexibility.",
        solution: "Cache modernized the IT infrastructure with VMware virtualization, Cisco enterprise solutions, and cloud-managed services, ensuring a secure, scalable, and future-ready digital foundation for innovation and growth.",
        results: [
          "Scalable digital foundation established",
          "Future-ready architecture implemented",
          "Enhanced innovation capabilities",
          "Improved growth potential"
        ]
      },
      "Compliance and Budgeting Solutions": {
        challenge: "Healthcare and hospitality organizations operate in highly regulated environments where compliance, budgeting, and financial accountability are critical. Untracked cloud expenses created risks of audit issues and budget overruns.",
        solution: "Cache's FinOps framework introduced automated reporting, cost allocation, and compliance-driven tracking, ensuring financial governance aligned with industry regulations and budget goals.",
        results: [
          "Automated reporting implemented",
          "Cost allocation established",
          "Compliance-driven tracking enabled",
          "Financial governance aligned with regulations"
        ]
      },
      "Resource Utilization Optimization": {
        challenge: "Many organizations were overprovisioning cloud resources, leading to waste. Idle workloads and underutilized infrastructure increased costs without contributing to service improvements.",
        solution: "Through cloud FinOps optimization, Cache identified idle resources, rightsized workloads, and implemented auto-scaling mechanisms, resulting in significant cost savings while maintaining performance and reliability.",
        results: [
          "Idle resources identified",
          "Workloads rightsized",
          "Auto-scaling mechanisms implemented",
          "Significant cost savings with maintained performance"
        ]
      },
      "Reliable Data Backup & Disaster Recovery": {
        challenge: "Government institutions faced challenges in managing sensitive tender data, as existing systems lacked robust backup and recovery mechanisms. This posed risks of data loss, downtime, and compliance failures.",
        solution: "Cache implemented a CDAC-backed tender data backup system with Cisco data center infrastructure, ensuring secure, reliable, and redundant data storage for critical governance operations.",
        results: [
          "Secure data storage implemented",
          "Redundant backup systems deployed",
          "Critical operations protected",
          "CDAC-backed tender data backup system"
        ]
      },
      "Security Monitoring & Threat Detection": {
        challenge: "Traditional setups had minimal visibility into security threats and were unable to process large volumes of event logs, leaving governance bodies vulnerable to cyberattacks and insider threats.",
        solution: "Cache deployed a SIEM tool integrated with Microfocus 2000 EPS, enabling real-time log analysis, threat detection, and incident response. This significantly improved overall cybersecurity posture.",
        results: [
          "Real-time log analysis enabled",
          "Threat detection implemented",
          "Incident response capabilities",
          "SIEM tool with Microfocus 2000 EPS"
        ]
      },
      "Infrastructure Modernization & Upgrade": {
        challenge: "Government departments struggled with aging routers, insufficient storage systems, and fragmented IT hardware, causing inefficiencies, slow performance, and frequent outages.",
        solution: "Cache upgraded the infrastructure by installing enterprise-grade routers and advanced storage solutions, creating a robust, future-ready IT backbone capable of supporting large-scale governance services.",
        results: [
          "Enterprise-grade infrastructure deployed",
          "Performance optimization achieved",
          "Future-ready IT backbone",
          "Advanced storage and networking solutions"
        ]
      },
      "Hardware Maintenance & Support Services": {
        challenge: "Organizations struggled with aging laptops, desktops, and servers, leading to frequent hardware failures and disruptions in daily operations.",
        solution: "Cache provided server AMC (Annual Maintenance Contract) services and regular hardware support for laptops and desktops, ensuring reliable operations and minimized downtime.",
        results: [
          "Reliable operations ensured",
          "Minimized downtime achieved",
          "Regular maintenance provided",
          "Server AMC services implemented"
        ]
      },
      "License Management & Compliance": {
        challenge: "IT/ITES companies faced risks due to expired software licenses, including non-compliance issues, potential fines, and interrupted access to critical applications.",
        solution: "Cache managed license renewal services, ensuring all software and tools remained up-to-date, compliant, and fully functional, avoiding operational or legal risks.",
        results: [
          "Software compliance maintained",
          "Legal risks avoided",
          "Uninterrupted application access",
          "Up-to-date software tools"
        ]
      },
      "Centralized IT Asset Management": {
        challenge: "Without a structured maintenance and renewal process, organizations were spending more on ad-hoc repairs and losing track of hardware lifecycle, reducing overall IT efficiency.",
        solution: "Cache implemented a centralized IT asset management approach covering laptops, desktops, and servers, providing proactive maintenance, planned upgrades, and cost-efficient IT operations.",
        results: [
          "Proactive maintenance implemented",
          "Cost-efficient operations achieved",
          "Planned upgrades scheduled",
          "Centralized asset management"
        ]
      }
    };

    return detailedData[title]?.[section] || "Content not available";
  };

  return (
    <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 bg-white scroll-mt-20" id="success-stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Success <span className="text-red-600">Stories</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how we've helped leading organizations transform their business through innovative system integration solutions.
          </p>
        </div>

        <div className="space-y-6">
          {caseStudies.map((study, index) => (
            <div key={study.id}>
              <Card className="overflow-hidden h-auto hover:shadow-2xl transition-all duration-300 group bg-linear-to-br from-white to-gray-50 border-0 shadow-lg">
                <div className={`grid lg:grid-cols-2 lg:items-stretch gap-4 lg:gap-0 ${index % 2 !== 0 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={`relative h-56 sm:h-60 lg:h-full ${index % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                    <ImageWithFallback
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-red-600/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white border-0 shadow-lg">
                        {study.industry}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className={`p-3 sm:p-4 lg:p-8 mt-3 lg:mt-0 flex flex-col justify-between h-full ${index % 2 !== 0 ? 'lg:col-start-1' : ''} relative`}>
                    <div className="space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-xs text-gray-600 bg-white px-3 py-2 rounded-full shadow-sm">
                          <Clock className="w-3 h-3 mr-1 text-red-600" />
                          {study.duration}
                        </div>
                      </div>
                      
                      <h3 className="text-xl lg:text-2xl font-bold text-black group-hover:text-red-600 transition-colors leading-tight">
                        {study.title}
                      </h3>
                      
                      <div className="space-y-2">
                        <p className="text-gray-700 leading-relaxed text-base">
                          {study.challenge}
                        </p>
                        <span 
                          className="text-red-600 font-medium text-sm hover:text-red-700 transition-colors cursor-pointer inline-block"
                          onClick={() => handleViewDetails(study)}
                        >
                          View more
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-red-100">
                        <TrendingUp className="w-5 h-5 text-red-600 mx-auto mb-2" />
                        <div className="font-bold text-black text-sm leading-tight">{study.results.efficiency}</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-red-100">
                        <Users className="w-5 h-5 text-red-600 mx-auto mb-2" />
                        <div className="font-bold text-black text-sm leading-tight">{study.results.cost}</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-red-100">
                        <Clock className="w-5 h-5 text-red-600 mx-auto mb-2" />
                        <div className="font-bold text-black text-sm leading-tight">{study.results.uptime}</div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            View All Case Studies
          </motion.button>
        </motion.div> */}

        {/* Modal */}
        {selectedStudy && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl md:h-[60vh] h-auto max-h-[85vh] relative shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <h3 className="text-xl font-bold text-black">Case Study Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 h-full overflow-y-auto">
                {/* Title and Industry */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-black mb-2">{selectedStudy.title}</h2>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                    {selectedStudy.industry}
                  </span>
                </div>

                {/* Challenge and Solution Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  {/* Challenge Section */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-red-600 font-bold">⚠</span>
                      </div>
                      <h3 className="text-lg font-bold text-red-600">Challenge</h3>
                    </div>
                    <p className="text-red-600 leading-relaxed text-sm font-medium">
                      {getDetailedContent(selectedStudy.title, 'challenge')}
                    </p>
                  </div>

                  {/* Solution Section */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <h3 className="text-lg font-bold text-green-600">Solution</h3>
                    </div>
                    <p className="text-green-600 leading-relaxed text-sm font-medium">
                      {getDetailedContent(selectedStudy.title, 'solution')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}