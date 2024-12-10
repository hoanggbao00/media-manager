'use client'

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  tag: 'image' | 'video' | 'youtube';
}

export default function MediaTag({tag}: Props) {
  
  return (
    <Badge className={cn("text-xs", {
      'bg-green-300 ': tag === 'image',
      'bg-yellow-300 hover:bg-yellow-500 text-black': tag === 'video',
      'bg-red-400 text-destructive-foreground hover:bg-red-500': tag === 'youtube',
    })}>{tag.toUpperCase()}</Badge>
  );
}