import { goerliTestnetTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    vaultPid: 0,
    lpSymbol: 'ETH-9INCH LP',
    lpAddress: '0x224E4d86886377eFDfD5e144772b1175920cB048',
    token: goerliTestnetTokens.sfy,
    quoteToken: goerliTestnetTokens.weth,
  },
  {
    pid: 1,
    vaultPid: 1,
    lpSymbol: 'ETH-BBC LP',
    lpAddress: '0x79Da21BA74AF3cAC8e930df20b023B748a955d9d',
    quoteToken: goerliTestnetTokens.weth,
    token: goerliTestnetTokens.inc,
  },
  {
    pid: 2,
    vaultPid: 2,
    lpSymbol: 'BBC-9INCH LP',
    lpAddress: '0x9665C84e5AD2356B323ad60053feAE98126ab91D',
    quoteToken: goerliTestnetTokens.inc,
    token: goerliTestnetTokens.cake,
  },
  {
    pid: 3,
    vaultPid: 3,
    lpSymbol: 'PLD-BBC LP',
    lpAddress: '0x01a1AE7C459b4fE28D77E0B7FF4129041ec9c433',
    quoteToken: goerliTestnetTokens.pld,
    token: goerliTestnetTokens.inc,
  },
  {
    pid: 4,
    vaultPid: 4,
    lpSymbol: 'PP-BBC LP',
    lpAddress: '0x84e94d25A444Ed94c72f0EC3169Fd203069E4E5a',
    quoteToken: goerliTestnetTokens.pp,
    token: goerliTestnetTokens.inc,
  },
  {
    pid: 5,
    vaultPid: 5,
    lpSymbol: 'HEX-BBC LP',
    lpAddress: '0x9a4b59187C4079aE6f965474EF6Fe0c36895Edd3',
    quoteToken: goerliTestnetTokens.hex,
    token: goerliTestnetTokens.inc,
  },
  {
    pid: 6,
    vaultPid: 6,
    lpSymbol: 'DBI-BBC LP',
    lpAddress: '0xFE1837863c473B583ff76eEa9Ce0c1F712679498',
    quoteToken: goerliTestnetTokens.dbi,
    token: goerliTestnetTokens.inc,
  },
  {
    pid: 7,
    vaultPid: 7,
    lpSymbol: 'HDRN-BBC LP',
    lpAddress: '0x0d76c8d0Cde2c4162D74560A711d179fE08DDEF7',
    quoteToken: goerliTestnetTokens.hdrn,
    token: goerliTestnetTokens.inc,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
