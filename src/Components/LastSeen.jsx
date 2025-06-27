import React from 'react'
import ReactTimeAgo from 'react-time-ago'

const LastSeen = ({time}) => {
  return (
    <div>
    <ReactTimeAgo timeStyle='twitter' date={time} locale="en-US" />
    </div>
  )
}

export default LastSeen