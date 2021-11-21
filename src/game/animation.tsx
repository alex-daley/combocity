import { Fragment, cloneElement, useState, useEffect } from 'react'

interface AnimationProps {
  children: any // FIXME: Use type
  cssName?: string
  in?: boolean
}

function Animation({children, cssName, in: show}: AnimationProps) {

  if (!show) {
    return children
  }

  const withClassName = cloneElement(children, {
    className: `${children.props.className} ${cssName}`
  })

  return (
    <Fragment>
      {withClassName}
    </Fragment>
  )
}

export default Animation
