/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path'
import fs from 'fs'
import farm1 from '../constants/ethereum'
import farm5 from '../constants/goerli'
import farm97 from '../constants/bsc_testnet'
import farm56 from '../constants/bsc'

import lpHelpers1 from '../constants/priceHelperLps/ethereum'
import lpHelpers5 from '../constants/priceHelperLps/goerli'
import lpHelpers97 from '../constants/priceHelperLps/bsc_testnet'
import lpHelpers56 from '../constants/priceHelperLps/bsc'
import { ChainId } from '@pancakeswap/sdk'

const chains = [
  [ChainId.ETHEREUM, farm1, lpHelpers1],
  [ChainId.GOERLI, farm5, lpHelpers5],
  [ChainId.BSC, farm56, lpHelpers56],
  [ChainId.BSC_TESTNET, farm97, lpHelpers97],
]

export const saveList = async () => {
  console.info('save farm config...')
  try {
    fs.mkdirSync(`${path.resolve()}/lists`)
    fs.mkdirSync(`${path.resolve()}/lists/priceHelperLps`)
  } catch (error) {
    //
  }
  for (const [chain, farm, lpHelper] of chains) {
    console.info('Starting build farm config', chain)
    const farmListPath = `${path.resolve()}/lists/${ChainId[chain as ChainId].toLowerCase()}.json`
    const stringifiedList = JSON.stringify(farm, null, 2)
    fs.writeFileSync(farmListPath, stringifiedList)
    console.info('Farm list saved to ', farmListPath)
    const lpPriceHelperListPath = `${path.resolve()}/lists/priceHelperLps/${ChainId[chain as ChainId].toLowerCase()}.json`
    const stringifiedHelperList = JSON.stringify(lpHelper, null, 2)
    fs.writeFileSync(lpPriceHelperListPath, stringifiedHelperList)
    console.info('Lp list saved to ', lpPriceHelperListPath)
  }
}

saveList()
