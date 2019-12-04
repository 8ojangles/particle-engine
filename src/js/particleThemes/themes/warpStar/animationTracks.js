let animationTracks = [
    // {
    //     animName: 'radiusGrow',
    //     active: true,
    //     param: 'r',
    //     baseAmount: 'initR',
    //     targetValuePath: 'targetRadius',
    //     duration: 'life',
    //     easing: 'linearEase',
    //     linkedAnim: false
    // },
    {
        animName: 'fadeIn',
        active: true,
        param: 'globalAlpha',
        baseAmount: 0,
        targetValuePath: 1,
        duration: 4,
        easing: 'easeInCubic',
        linkedAnim: false
    }
]

module.exports.animationTracks = animationTracks;