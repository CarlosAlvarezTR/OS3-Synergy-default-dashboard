interface LeftIconProps {
  className?: string
  width?: number
  height?: number
}

export function LeftIcon({ className = "", width = 16, height = 16 }: LeftIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 1V1.5V3H15.5H16V4H15.5H14V5.5V6H13V5.5V4H11.5H11V3H11.5H13V1.5V1H14ZM14 10V10.5V12H15.5H16V13H15.5H14V14.5V15H13V14.5V13H11.5H11V12H11.5H13V10.5V10H14ZM10.875 8.5625L8 10L6.53125 12.9062L6 14L5.4375 12.9062L4 10L1.09375 8.5625L0 8L1.09375 7.46875L4 6L5.4375 3.125L6 2L6.53125 3.125L8 6L10.875 7.46875L12 8L10.875 8.5625ZM7.09375 9.5625L7.25 9.28125L7.53125 9.125L9.75 8L7.53125 6.90625L7.25 6.75L7.09375 6.46875L6 4.25L4.875 6.46875L4.71875 6.75L4.4375 6.90625L2.21875 8L4.4375 9.125L4.71875 9.28125L4.875 9.5625L6 11.7812L7.09375 9.5625Z"
        fill="currentColor"
      />
    </svg>
  )
}
