import React from 'react';

import templateOneHook from '../shared/components/HoC/TemplateOneHoC/TemplateOneHoC';

const Welcome = templateOneHook({
  Menu: () => <h1>Welcome</h1>,
  Content: () => <h1>Content</h1>,
});

export default Welcome;
