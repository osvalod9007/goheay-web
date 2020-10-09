import React from 'react';

import templateOneHook from '../shared/components/HoC/TemplateOneHoC/TemplateOneHoC';

const Ride = templateOneHook({
  Menu: () => <h1>Ride</h1>,
  Content: () => <h1>Content</h1>,
});

export default Ride;
