import React, {Suspense} from 'react';
import {RiftProvider, RiftGate} from 'rift-router';
import {observer} from 'mobx-react-lite';

import {routes} from './Routes';

const Routing: React.FC = observer(() => {
  return (
    <RiftProvider routes={routes}>
      <Suspense fallback={<p>Loading..</p>}>
        <RiftGate /> {/* render the component for current route */}
      </Suspense>
    </RiftProvider>
  );
});

export default Routing;
