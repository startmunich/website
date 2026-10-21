'use client';

import { ArrowRightIcon, ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { ProfileCard } from '@/components/site/profile-card';
import { Button } from '@/components/ui/button';
import { Card, CardMedia } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { Eyebrow, Text } from '@/components/ui/typography';

import { type BoardMember, useBoards } from './useBoards';

function BoardGroup({ title, members }: { title: string; members: BoardMember[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-6 bg-primary" />
        <Eyebrow render={<span />} className="text-xs">
          {title}
        </Eyebrow>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {members.map((member) => (
          <ProfileCard
            key={member.role}
            variant="overlay"
            size="sm"
            name={member.name}
            role={member.role}
            imageUrl={member.profileImage || undefined}
            linkedinUrl={member.linkedinUrl}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
          />
        ))}
      </div>
    </div>
  );
}

/** Past and present boards; selecting one shows its executive and department board. */
export function BoardsSection() {
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  const boards = useBoards(expandedBoard);
  const board = boards.find((b) => b.id === expandedBoard);

  if (board) {
    return (
      <div className="flex flex-col gap-10">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 self-start text-muted-foreground"
          onClick={() => setExpandedBoard(null)}
        >
          <ChevronLeftIcon />
          Back to all boards
        </Button>
        <BoardGroup title="Executive Board" members={board.executiveBoard} />
        <BoardGroup title="Department Board" members={board.departmentBoard} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {boards.map((b, i) => (
        <Reveal key={b.id} delay={i * 100}>
          <Card
            interactive
            className="group/card w-full gap-0 py-0 text-left"
            render={<button type="button" onClick={() => setExpandedBoard(b.id)} />}
          >
            <CardMedia className="h-52">
              <Image
                src={b.imageUrl}
                alt={b.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                style={{ objectPosition: b.imageObjectPosition ?? 'center' }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-black tracking-tight uppercase">{b.name}</h3>
                <Text variant="label" className="mt-1">
                  {b.year}
                </Text>
              </div>
            </CardMedia>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">
                {b.executiveBoard.length + b.departmentBoard.length} members
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover/card:translate-x-1">
                View board <ArrowRightIcon className="size-4" />
              </span>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
