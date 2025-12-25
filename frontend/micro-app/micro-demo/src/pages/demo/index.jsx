import { useState } from 'react';
import { Button } from 'antd';
function Demo() {
  const [count, setcount] = useState(0);
  return (
    <>
      count: {count}
      <Button type="primary" onClick={() => setcount(count + 1)}>
        hello
      </Button>
    </>
  );
}

export default Demo;
