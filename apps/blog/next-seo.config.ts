import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  // titleTemplate: '%s | 9INCH',
  titleTemplate: '9INCH - Dex & Yieldfarm',
  defaultTitle: 'Blog | 9INCH',
  description:
    'Cheaper and faster than Uniswap? Discover PancakeSwap, the leading DEX on BNB Smart Chain (BSC) with the best farms in DeFi and a lottery for BBC.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@PancakeSwap',
    site: '@PancakeSwap',
  },
  openGraph: {
    title: '🥞 PancakeSwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description:
      '9inch.io is a community-focused DEX & Yield-Farm. Earn passive income by providing liquidity to your favourite tokens. Launching on Ethereum & PulseChain.',
    images: [{ url: 'https://tacofy-swap.web.app/images/swapify.png' }],
  },
}
