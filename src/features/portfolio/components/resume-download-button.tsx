"use client";

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

interface ResumeDownloadButtonProps {
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    className?: string;
    label?: string;
    showIcon?: boolean;
    href?: string;
}

export function ResumeDownloadButton({
                                         variant = "outline",
                                         size = "sm",
                                         className,
                                         label,
                                         showIcon = true,
                                         href = "/Amin_Khoddam_Frontend_Developer.pdf",
                                     }: ResumeDownloadButtonProps) {
    const t = useTranslations("resume");

    return (
        <Button variant={variant} size={size} className={className} asChild>
            <a href={href} target="_blank" rel="noopener noreferrer">
                {showIcon ? <ExternalLink data-icon="inline-start" /> : null}
                {label ?? t("title")}
            </a>
        </Button>
    );
}