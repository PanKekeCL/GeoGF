// <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
const PlayIcon = ({ color = "currentColor", size = 30 }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -960 960 960" 
      fill={color} 
      width={size} 
      height={size}
    >
      <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
    </svg>
  );
  
  export default PlayIcon;