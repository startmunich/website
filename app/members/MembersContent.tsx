"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import Hero from "@/components/Hero"
import HeroCard from "@/components/HeroCard"
import { useAnimatedNumber } from "@/lib/useAnimatedNumber"
import { useInView } from "@/lib/hooks"

export const dynamic = 'force-dynamic'

interface Member {
  id: number
  name: string
  batch: string
  role: string
  study?: string
  university?: string
  company?: string
  linkedinUrl?: string
  imageUrl: string
  profileImage?: string
  bio?: string
  expertise?: string[]
  achievements?: string
  gender?: string
}

interface BoardMember {
  name: string
  role: string
  imageUrl: string
  profileImage?: string
  linkedinUrl?: string
  _hasMatch?: boolean
}

interface Board {
  id: string
  name: string
  year: string
  imageUrl: string
  imageObjectPosition?: string
  executiveBoard: BoardMember[]
  departmentBoard: BoardMember[]
}

async function fetchMembers(): Promise<Member[]> {
  try {
    const response = await fetch('/api/members')
    if (!response.ok) throw new Error('Failed to fetch members')
    return await response.json()
  } catch (error) {
    console.error('Error fetching members:', error)
    return []
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null)
  const [boardLoading, setBoardLoading] = useState(false)
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '25-26', name: 'Board 25-26', year: '2025-2026', imageUrl: '/ourMembers/boads/boad26.jpeg',
      executiveBoard: [
        { name: 'BOARD MEMBER', role: 'CFO', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'President', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'Vice President', imageUrl: '/ourMembers/hero-opt.png' },
      ],
      departmentBoard: [
        { name: 'BOARD MEMBER', role: 'MD Events', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Marketing', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD People', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Finance & Operations', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Partnerships', imageUrl: '/ourMembers/hero-opt.png' },
      ],
    },
    {
      id: '24-25', name: 'Board 24-25', year: '2024-2025', imageUrl: '/ourMembers/boads/board25.jpg',
      executiveBoard: [
        { name: 'SIMON BURMER', role: 'CFO', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/simon-burmer/' },
        { name: 'ALI SERAG EL DIN', role: 'President', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/ali-serag-el-din/' },
        { name: 'DEFNE AYTUNA', role: 'Vice President', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/defne-aytuna/' },
      ],
      departmentBoard: [
        { name: 'MOHAMMED THABIT', role: 'MD Events', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/mohammed-thabit/' },
        { name: 'PIOTR NOBIS', role: 'MD Marketing', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/piotr-nobis/' },
        { name: 'ANNA HELETYCH', role: 'MD People', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/anna-heletych/' },
        { name: 'NIKLAS SIMAKOV', role: 'MD Finance & Operations', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/niklas-simakov/' },
        { name: 'MARIUS HEUMADER', role: 'MD Partnerships', imageUrl: '/ourMembers/hero-opt.png', linkedinUrl: 'https://www.linkedin.com/in/marius-heumader/' },
      ],
    },
    {
      id: '23-24', name: 'Board 23-24', year: '2023-2024', imageUrl: '/ourMembers/hero-opt.png',
      executiveBoard: [
        { name: 'BOARD MEMBER', role: 'President', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'Vice-President', imageUrl: '/ourMembers/hero-opt.png' },
      ],
      departmentBoard: [
        { name: 'BOARD MEMBER', role: 'MD Events', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Marketing', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD People', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Finance & Operations', imageUrl: '/ourMembers/hero-opt.png' },
        { name: 'BOARD MEMBER', role: 'MD Partnerships', imageUrl: '/ourMembers/hero-opt.png' },
      ],
    },
  ])

  const analyticsView = useInView(0.1)
  const boardsView = useInView(0.1)
  const batchesView = useInView(0.1)

  const animatedActiveMembers = useAnimatedNumber(70, false, 1000)
  const animatedAlumniCount = useAnimatedNumber(600, false, 1000)

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/)
    if (words.length === 0) return ''
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  const isPlaceholderImage = (url?: string) => {
    if (!url) return true
    const normalized = url.toLowerCase().trim()
    return normalized === '/batch-opt.jpeg' || normalized.endsWith('/batch-opt.jpeg') ||
      normalized === '/batch-opt.jpg' || normalized.endsWith('/batch-opt.jpg') ||
      normalized === '/batch-opt.png' || normalized.endsWith('/batch-opt.png') ||
      normalized === '/example-opt.png' || normalized.endsWith('/example-opt.png') ||
      normalized === '/example.png' || normalized.endsWith('/example.png') ||
      normalized === '/ourmembers/hero-opt.png' || normalized.endsWith('/ourmembers/hero-opt.png')
  }

  useEffect(() => {
    const loadMembers = async () => {
      const data = await fetchMembers()
      setMembers(data)
    }
    loadMembers()
  }, [])

  const normalize = (text: string) =>
    text.toLowerCase().replace(/[\.\-&\/]/g, ' ').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()

  const roleSynonyms: Record<string, string[]> = {
    cfo: ['chief financial officer', 'chief financial officer (cfo)'],
    'vice president': ['vice-president', 'vice president', 'vp'],
    'md finance operations': ['md finance & operations', 'md finance and operations'],
    'md partnerships': ['md partnerships', 'md partnership'],
    'md marketing': ['md marketing'],
    'md people': ['md people'],
    'md events': ['md events'],
    president: ['president'],
  }

  const roleFallbackImages: Record<string, string> = {
    cfo: '/ourMembers/hero-opt.png', president: '/ourMembers/hero-opt.png', 'vice president': '/ourMembers/hero-opt.png',
    'md events': '/ourMembers/hero-opt.png', 'md marketing': '/ourMembers/hero-opt.png', 'md people': '/ourMembers/hero-opt.png',
    'md finance operations': '/ourMembers/hero-opt.png', 'md finance & operations': '/ourMembers/hero-opt.png', 'md partnerships': '/ourMembers/hero-opt.png',
  }

  const getFallbackImageByRole = (role: string) =>
    roleFallbackImages[normalize(role)] ||
    Object.entries(roleFallbackImages).find(([key]) => normalize(role).includes(key))?.[1] ||
    '/ourMembers/hero-opt.png'

  const termStartYearFromBoard = (board: Board) => {
    // Special mapping: Board IDs to API years
    if (board.id === '25-26') return '2026'
    if (board.id === '24-25') return '2025'
    if (board.id === '23-24') return '2023'

    if (board.year && board.year.includes('-')) {
      const [from] = board.year.split('-').map(v => v.trim())
      if (/^\d{4}$/.test(from)) return from
    }
    const parts = board.id.split('-').map(p => Number(p.trim()))
    if (parts.length === 2 && !Number.isNaN(parts[0])) {
      const from = parts[0] < 100 ? 2000 + parts[0] : parts[0]
      return `${from}`
    }
    return '2024'
  }

  const findByRole = (normalizedBoardMembers: any[]) => (role: string) => {
    if (!role) return null
    const normalizedRole = normalize(role)
    let match = normalizedBoardMembers.find(m => normalize(m.role || '') === normalizedRole)
    if (match) return match
    const normalizedRoleKey = Object.keys(roleSynonyms).find(key =>
      key === normalizedRole || roleSynonyms[key].includes(normalizedRole)
    )
    if (normalizedRoleKey) {
      const aliases = [normalizedRoleKey, ...(roleSynonyms[normalizedRoleKey] || [])].map(normalize)
      match = normalizedBoardMembers.find(m => {
        const candidate = normalize(m.role || '')
        return aliases.some(alias => candidate.includes(alias) || alias.includes(candidate))
      })
      if (match) return match
    }
    return normalizedBoardMembers.find(m => {
      const candidateRole = normalize(m.role || '')
      return candidateRole.includes(normalizedRole) || normalizedRole.includes(candidateRole)
    }) || null
  }

  const loadBoardMembers = async (boardId: string) => {
    setBoardLoading(true)
    try {
      const board = boards.find(b => b.id === boardId)
      if (!board) return
      const termStartYear = termStartYearFromBoard(board)
      const response = await fetch(`/api/board?termStartYears=${encodeURIComponent(termStartYear)}`)
      if (!response.ok) return
      const data = await response.json()
      if (!data) return
      const candidateData = Array.isArray(data) ? data : data?.data && Array.isArray(data.data) ? data.data : []
      const rawMembers: any[] = []
      candidateData.forEach((item: any) => {
        if (item && Array.isArray(item.members)) rawMembers.push(...item.members)
        else if (item && Array.isArray(item.boardMembers)) rawMembers.push(...item.boardMembers)
        else if (item && Array.isArray(item.memberList)) rawMembers.push(...item.memberList)
        else if (item && item.name && item.role) rawMembers.push(item)
      })
      if (rawMembers.length === 0) return
      const normalizedBoardMembers = rawMembers.flatMap((member: any) => {
        const normalizedName = member.name || member.fullName || member.displayName || 'Board Member'
        const normalizedRole = member.role || member.position || member.title || ''
        const profileImage = member.profileImage || ''
        const splitRoles = normalizedRole.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0)
        if (splitRoles.length <= 1) return [{ ...member, name: normalizedName, role: normalizedRole, profileImage }]
        return splitRoles.map((rolePart: string) => ({ ...member, name: normalizedName, role: rolePart, profileImage }))
      })
      const matchByRole = findByRole(normalizedBoardMembers)
      setBoards(prev => prev.map(boardItem => {
        if (boardItem.id !== boardId) return boardItem
        return {
          ...boardItem,
          executiveBoard: boardItem.executiveBoard.map(member => {
            const match = matchByRole(member.role)
            const fallback = getFallbackImageByRole(member.role)
            const hasMatch = !!match
            return { ...member, name: match?.name || (hasMatch ? member.name : 'N/A'), profileImage: match?.profileImage || member.profileImage || '', imageUrl: match?.profileImage || member.profileImage || member.imageUrl || fallback, linkedinUrl: match?.linkedinUrl || member.linkedinUrl, _hasMatch: hasMatch }
          }),
          departmentBoard: boardItem.departmentBoard.map(member => {
            const match = matchByRole(member.role)
            const fallback = getFallbackImageByRole(member.role)
            const hasMatch = !!match
            return { ...member, name: match?.name || (hasMatch ? member.name : 'N/A'), profileImage: match?.profileImage || member.profileImage || '', imageUrl: match?.profileImage || member.profileImage || member.imageUrl || fallback, linkedinUrl: match?.linkedinUrl || member.linkedinUrl, _hasMatch: hasMatch }
          }),
        }
      }))
    } catch (error) {
      console.error('Error fetching board data:', error)
    } finally {
      setBoardLoading(false)
    }
  }

  useEffect(() => {
    if (expandedBoard) loadBoardMembers(expandedBoard)
  }, [expandedBoard])

  useEffect(() => {
    void (async () => {
      for (const board of boards) await loadBoardMembers(board.id)
    })()
  }, [])

  const defaultBatches = [
    'Winter 2025', 'Summer 2025',
    'Winter 2024', 'Summer 2024',
    'Winter 2023', 'Summer 2023',
    'Winter 2022', 'Summer 2022',
    'Winter 2021',
  ]
  const allBatches = Array.from(new Set([...members.map(m => m.batch), ...defaultBatches]))
    .filter(Boolean).sort().reverse()

  const malePercentage = 59
  const femalePercentage = 41

  const topStudies = [
    { study: 'Computer Science', percentage: 40 },
    { study: 'Business Administration', percentage: 30 },
    { study: 'Engineering', percentage: 16 },
    { study: 'Others', percentage: 14 },
  ]

  const topUniversities = [
    { university: 'TUM', percentage: 65 },
    { university: 'LMU', percentage: 20 },
    { university: 'HM', percentage: 7 },
    { university: 'Others', percentage: 8 },
  ]

  const batchImageMap: Record<string, string> = {
    ws21: 'WS21-opt.jpg', ws22: 'WS22-opt.jpg', ws23: 'WS23-opt.jpg', ws24: 'WS24-opt.jpg', ws25: 'WS25-opt.jpg',
    ss22: 'SS22-opt.jpg', ss23: 'SS23-opt.jpg', ss24: 'SS24-opt.jpg', ss25: 'SS25-opt.jpg',
  }

  function getBatchImageKey(batchName: string): string | null {
    const normalized = batchName.toLowerCase().trim()
    const fullMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/)
    if (fullMatch) return `${fullMatch[1] === 'winter' ? 'ws' : 'ss'}${fullMatch[2].slice(-2)}`
    const fourDigitMatch = normalized.match(/^(ws|ss)\s*(\d{4})$/)
    if (fourDigitMatch) return `${fourDigitMatch[1]}${fourDigitMatch[2].slice(-2)}`
    const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2})$/)
    if (shortMatch) return `${shortMatch[1]}${shortMatch[2]}`
    return null
  }

  function isAfterWS21(batchName: string): boolean {
    const normalized = batchName.toLowerCase().trim()
    let year: number | null = null
    let isWinter = false
    const fullMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/)
    if (fullMatch) { year = parseInt(fullMatch[2].slice(-2)); isWinter = fullMatch[1] === 'winter' }
    const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2})$/)
    if (shortMatch) { year = parseInt(shortMatch[2]); isWinter = shortMatch[1] === 'ws' }
    if (year === null) return false
    if (year > 21) return true
    if (year === 21 && isWinter) return true
    return false
  }

  const sortedBatches = allBatches.map(batchName => {
    const batchKey = getBatchImageKey(batchName)
    const shouldShowImage = isAfterWS21(batchName)
    let groupImageUrl = '/ourMembers/hero-opt.png'
    if (shouldShowImage && batchKey && batchImageMap[batchKey]) {
      groupImageUrl = `/ourMembers/batches_group_pictures/${batchImageMap[batchKey]}`
    }
    return {
      name: batchName,
      semester: batchName.split(' ')[0] || 'Batch',
      year: batchName.split(' ')[1] || '',
      groupImageUrl,
      memberCount: members.filter(m => m.batch === batchName).length,
    }
  }).sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year)
    if (yearDiff !== 0) return yearDiff
    if (a.semester.toLowerCase().includes('winter') || a.semester.toLowerCase().startsWith('w')) return -1
    if (b.semester.toLowerCase().includes('winter') || b.semester.toLowerCase().startsWith('w')) return 1
    return 0
  })


  return (
    <>
      <Script id="iframe-height-sender" strategy="afterInteractive">
        {`
          function sendHeight() {
            const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            parent.postMessage({ type: "EMBED_HEIGHT", height: h }, "*");
          }
          window.addEventListener("load", sendHeight);
          const ro = new ResizeObserver(sendHeight);
          ro.observe(document.documentElement);
          document.addEventListener("DOMContentLoaded", sendHeight);
        `}
      </Script>

      <main className="min-h-screen bg-brand-dark-blue text-white overflow-x-hidden">

        {/* ═══ HERO ═══ */}
        <Hero
          backgroundImage="/ourMembers/hero-opt.png"
          title={
            <>
              START MUNICH
              <br />
              <span className="outline-text">MEMBERS</span>
            </>
          }
          description="Meet the ambitious student entrepreneurs building the future of technology and innovation."
        >
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6">
            <HeroCard>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-4xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300">
                  {Math.floor(animatedActiveMembers)}
                </span>
                <span className="text-xl lg:text-3xl font-bold text-brand-pink">+</span>
              </div>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Active Members</p>
            </HeroCard>
            <HeroCard>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-4xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300">
                  {Math.floor(animatedAlumniCount)}
                </span>
                <span className="text-xl lg:text-3xl font-bold text-brand-pink">+</span>
              </div>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Alumni</p>
            </HeroCard>
          </div>
        </Hero>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══ COMMUNITY ANALYTICS ═══ */}
          <section ref={analyticsView.ref} className="py-12">
            <div className={`mb-8 transition-all duration-700 ${analyticsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">By the Numbers</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2">COMMUNITY ANALYTICS</h2>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-150 ${analyticsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Gender */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-brand-pink text-xs font-bold tracking-[0.25em] uppercase">Gender Distribution</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Male</span>
                      <span className="text-white font-bold text-sm">{malePercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${malePercentage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Female</span>
                      <span className="text-white font-bold text-sm">{femalePercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-pink to-pink-400 rounded-full transition-all duration-1000" style={{ width: `${femalePercentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Fields */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-brand-pink text-xs font-bold tracking-[0.25em] uppercase">Top Study Fields</span>
                </div>
                <div className="space-y-3">
                  {topStudies.map(({ study, percentage }) => (
                    <div key={study} className="flex items-center justify-between gap-4">
                      <span className="text-gray-300 text-sm truncate">{study}</span>
                      <span className="text-brand-pink text-sm font-bold flex-shrink-0">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Universities */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-brand-pink text-xs font-bold tracking-[0.25em] uppercase">Top Universities</span>
                </div>
                <div className="space-y-3">
                  {topUniversities.map(({ university, percentage }) => (
                    <div key={university} className="flex items-center justify-between gap-4">
                      <span className="text-gray-300 text-sm truncate">{university}</span>
                      <span className="text-brand-pink text-sm font-bold flex-shrink-0">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ═══ THE BOARDS ═══ */}
          <section ref={boardsView.ref} className="py-12">
            <div className={`mb-8 transition-all duration-700 ${boardsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">Leadership</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2">THE BOARDS</h2>
            </div>

            {expandedBoard ? (
              <div className={`transition-all duration-700 ${boardsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button
                  onClick={() => setExpandedBoard(null)}
                  className="mb-8 group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back to all boards</span>
                </button>

                {boards.filter(b => b.id === expandedBoard).map(board => (
                  <div key={board.id} className="space-y-10">
                    {/* Executive Board */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-px bg-brand-pink" />
                        <span className="text-brand-pink text-xs font-bold tracking-[0.35em] uppercase">Executive Board</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {board.executiveBoard.map((member, i) => (
                          <a key={i} href={member.linkedinUrl || '#'} target={member.linkedinUrl ? '_blank' : undefined} rel={member.linkedinUrl ? 'noopener noreferrer' : undefined} className={`relative${member.linkedinUrl ? ' cursor-pointer' : ' cursor-default'}`}>
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                              {member.profileImage ? (
                                <Image src={member.profileImage} alt={member.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw" className="object-cover object-top" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-3xl font-black">
                                  {member.name === 'N/A' ? 'N/A' : getInitials(member.name)}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                <p className="font-black uppercase text-white text-xs leading-tight tracking-wide">{member.name}</p>
                                <p className="text-brand-pink text-[10px] font-semibold mt-1 uppercase tracking-widest">{member.role}</p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Department Board */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-px bg-brand-pink" />
                        <span className="text-brand-pink text-xs font-bold tracking-[0.35em] uppercase">Department Board</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {board.departmentBoard.map((member, i) => (
                          <a key={i} href={member.linkedinUrl || '#'} target={member.linkedinUrl ? '_blank' : undefined} rel={member.linkedinUrl ? 'noopener noreferrer' : undefined} className={`relative${member.linkedinUrl ? ' cursor-pointer' : ' cursor-default'}`}>
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                              {member.profileImage ? (
                                <Image src={member.profileImage} alt={member.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw" className="object-cover object-top" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-3xl font-black">
                                  {member.name === 'N/A' ? 'N/A' : getInitials(member.name)}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                <p className="font-black uppercase text-white text-xs leading-tight tracking-wide">{member.name}</p>
                                <p className="text-brand-pink text-[10px] font-semibold mt-1 uppercase tracking-widest">{member.role}</p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-150 ${boardsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {boards.map((board, i) => (
                  <button
                    key={board.id}
                    onClick={() => setExpandedBoard(board.id)}
                    className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-brand-pink/30 hover:bg-white/[0.07] transition-all duration-300 text-left"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="relative overflow-hidden h-52">
                      {board.imageUrl ? (
                        <Image src={board.imageUrl} alt={board.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: board.imageObjectPosition ?? 'center' }} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                          <span className="text-white/10 text-6xl font-black tracking-tight">{board.year}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{board.name}</h3>
                        <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{board.year}</p>
                      </div>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{board.executiveBoard.length + board.departmentBoard.length} members</span>
                      <span className="text-brand-pink text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">View board →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ═══ OUR BATCHES ═══ */}
          <section ref={batchesView.ref} className="py-12">
            <div className={`mb-8 transition-all duration-700 ${batchesView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-brand-pink text-sm font-bold tracking-[0.3em] uppercase">Our Community</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2">OUR BATCHES</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedBatches.map((batch, i) => (
                <div
                  key={batch.name}
                  className={`transition-all duration-700 ${batchesView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${150 + i * 80}ms` }}
                >
                  <Link
                    href={`/members/${encodeURIComponent(batch.name.replace(/\s+/g, '_'))}`}
                    className="block w-full group relative rounded-3xl overflow-hidden border border-white/10 hover:border-brand-pink/30 transition-all duration-300"
                  >
                    <div className="relative h-72 sm:h-80 overflow-hidden bg-white/5">
                      <img
                        src={batch.groupImageUrl}
                        alt={batch.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/70 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                        <h3 className="text-xl sm:text-2xl font-black text-white">{batch.name}</h3>
                        <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Explore →</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
