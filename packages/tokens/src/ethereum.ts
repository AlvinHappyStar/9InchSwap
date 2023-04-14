import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: new ERC20Token(
    ChainId.ETHEREUM,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    6,
    'USDT',
    'Tether USD',
    'https://tether.to/',
  ),
  usdc: new ERC20Token(
    ChainId.ETHEREUM,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    6,
    'USDC',
    'USD Coin',
  ),
  sfy: new ERC20Token(
    ChainId.ETHEREUM,
    '0x6f2E42BB4176e9A7352a8bF8886255Be9F3D2d13',
    18,
    '9INCH',
    '9inch Token',
    'https://www.singularitydao.ai/',
  ),
  inc: new ERC20Token(
    ChainId.ETHEREUM,
    '0xA3f7BF5b0fa93176c260BBa57ceE85525De2BaF4',
    18,
    'BBC',
    '9inch Wrapper Token',
    'https://stargate.finance/',
  ),
}
