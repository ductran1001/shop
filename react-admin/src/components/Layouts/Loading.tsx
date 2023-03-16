import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
    barColors: {
        '0': '#1d4ed8',
        '0.5': '#1d4ed8',
        '1.0': '#1d4ed8',
    },
    shadowBlur: 5,
});

export const Loading = () => <TopBarProgress />;
