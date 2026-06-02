import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date nicely
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format relative time (2 hours ago)
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

// Get service color
export function getServiceColor(service: string): string {
  const colors: Record<string, string> = {
    vpc: "#6366F1",
    subnet: "#8B5CF6",
    ec2: "#06B6D4",
    lambda: "#F59E0B",
    rds: "#22C55E",
    s3: "#F97316",
    sqs: "#EC4899",
    apigateway: "#14B8A6",
  };
  return colors[service] ?? "#94A3B8";
}

// Get service icon name
export function getServiceLabel(service: string): string {
  const labels: Record<string, string> = {
    vpc: "VPC",
    subnet: "Subnet",
    ec2: "EC2",
    lambda: "Lambda",
    rds: "RDS",
    s3: "S3",
    sqs: "SQS",
    apigateway: "API Gateway",
  };
  return labels[service] ?? service.toUpperCase();
}

// Truncate long strings
export function truncate(str: string, length: number = 20): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}