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
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[1].a',
        duration: 0.9,
        easing: 'linearEase',
        linkedAnim: false
    }
]

module.exports.animationTracks = animationTracks;