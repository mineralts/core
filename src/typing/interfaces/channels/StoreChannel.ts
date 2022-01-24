/*
 * packages/StoreChannel.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Channel from '../../../api/entities/channels/Channel'

export default interface StoreChannel extends Channel {
  nsfw: boolean
  permissions: any[]
}