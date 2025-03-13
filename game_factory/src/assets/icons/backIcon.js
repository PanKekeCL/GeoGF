// <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z"/></svg>
const BackIcon = ({ color = "currentColor", size = 24 }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -960 960 960" 
      fill={color} 
      width={size} 
      height={size}
    >
      <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" />
    </svg>
  );
  
  export default BackIcon;
  