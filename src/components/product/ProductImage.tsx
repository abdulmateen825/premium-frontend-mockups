import { useState, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type ProductFinish = 'Red' | 'Cream' | 'Black' | 'Detail';
export const productImagePaths = {
  red: '/assets/products/obsidian-one-red.webp',
  cream: '/assets/products/obsidian-one-cream.webp',
  black: '/assets/products/obsidian-one-black.webp',
  detail: '/assets/products/obsidian-one-detail.webp',
} as const;

// TODO: set to false when the four WebP files listed in productImagePaths are added.
const useReferencePlaceholder = true;
const referencePlaceholder = '/images/image.png';

export default function ProductImage({ src, alt, priority = false, finish = 'Red', className = '', parallax = false }: {
  src: string;
  alt: string;
  priority?: boolean;
  finish?: ProductFinish;
  className?: string;
  parallax?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imageSrc = useReferencePlaceholder ? referencePlaceholder : src;
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!parallax || reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientX - rect.left) / rect.width - .5) * 4, y: ((event.clientY - rect.top) / rect.height - .5) * -3 });
  };
  return <motion.figure
    className={`product-image ${className}`}
    data-finish={finish}
    onPointerMove={onPointerMove}
    onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    style={parallax ? { rotateX: tilt.y, rotateY: tilt.x, transformPerspective: 900 } : undefined}
    initial={priority ? { opacity: 0, scale: .96 } : { opacity: 0, scale: .985 }}
    animate={priority ? { opacity: 1, scale: 1 } : undefined}
    whileInView={!priority ? { opacity: 1, scale: 1 } : undefined}
    viewport={{ once: true, amount: .12 }}
    transition={{ duration: .42, ease: [.2, .75, .25, 1] }}
  >
    <AnimatePresence mode="sync" initial={false}>
      <motion.img
        key={`${src}-${finish}`}
        className="product-photo"
        src={imageSrc}
        alt={alt}
        width={500}
        height={750}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .3, ease: 'easeOut' }}
      />
    </AnimatePresence>
  </motion.figure>;
}
