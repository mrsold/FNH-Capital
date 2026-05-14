
export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    nav: {
      services: '服务',
      deals: '成交案例',
      about: '关于我们',
      contact: '联系我们',
      investors: '投资者',
      apply: '立即申请',
      admin: '管理员',
    },
    hero: {
      badge: '您的信赖，我们的承诺',
      title: '专业房地产贷款解决方案',
      subtitle: '为现代房地产投资者提供快速、可靠且透明的融资方案。',
      cta: '立即咨询',
      secondaryCta: '查看案例',
      fastClosing: '快速成交',
      fastClosingSubtitle: '最快可在 14 天内完成',
      fastClosingDesc: '我们的流程确保您的交易在您需要时及时完成。',
    },
    services: {
      title: '我们的服务',
      subtitle: '全面的方案满足您的各种融资需求',
      items: {
        residential: {
          title: '住宅贷款',
          desc: '为购房者或再融资提供灵活的住宅贷款方案。',
          points: ['1-4 单元', '购房或再融资', '外籍人士友好', '快速审批']
        },
        commercial: {
          title: '商业贷款',
          desc: '为多户住宅、办公楼和零售空间提供定制化商业融资。',
          points: ['5 单元以上', '办公与零售', '灵活期限', '具有竞争力的利率']
        },
        bridge: {
          title: '过桥融资',
          desc: '短期融资方案，帮助您快速抓住投资机会。',
          points: ['快速放款', '短期贷款', '修复和翻转', '资产抵押']
        }
      },
      getStarted: '开始咨询'
    },
    deals: {
      title: '最近成交案例',
      subtitle: '我们近期资助的房地产项目，展示我们的能力。',
      addBtn: '发布新案例',
      editBtn: '编辑案例',
      deleteBtn: '删除案例',
      form: {
        newTitle: '发布新案例更新',
        editTitle: '编辑案例更新',
        titleLabel: '标题',
        descLabel: '描述',
        statusLabel: '状态',
        amountLabel: '贷款金额 ($)',
        rateLabel: '利率',
        periodLabel: '贷款期限',
        locationLabel: '地点',
        typeLabel: '物业类型',
        imageLabel: '物业图片',
        upload: '上传图片',
        change: '更换图片',
        saveBtn: '保存案例',
        updateBtn: '更新案例',
        statusActive: '进行中',
        statusClosed: '已成交',
        statusFunding: '融资中',
        progressLabel: '融资进度 (%)',
        stillNeeded: '尚缺资金',
        fullyFunded: '已全额筹款'
      }
    },
    about: {
      badge: '关于 FNH CAPITAL',
      title: '您在湾区房地产领域的战略伙伴',
      philosophy: '我们的理念',
      philosophyText: '在 FNH Capital，我们专注于旧金山湾区的信托契据投资。作为深耕本地的专业经纪团队，我们为您提供受实物资产保护的稳健收益机会。',
      stats: {
        experience: '地产经验',
        quote: '快速报价',
        close: '快速成交'
      }
    },
    contact: {
      badge: '联系我们',
      title: '准备好开始下一个项目了吗？',
      subtitle: '联系我们的专家，讨论您的融资需求。',
      email: '电子邮箱',
      phone: '电话',
      office: '办公室',
      wechat: '微信',
      desc: '立即联系我们的专业贷款专员，获取您的住宅或商业项目的无义务报价。',
      form: {
        title: '贷款咨询表',
        nameLabel: '全名',
        emailLabel: '电子邮箱',
        typeLabel: '贷款类型',
        roleLabel: '我是',
        roleBorrower: '借款人',
        roleInvestor: '投资者',
        accreditedLabel: '我是一名合格投资者 (Accredited Investor)',
        investAmountLabel: '预计投资金额',
        investAmountOptions: ['少于 $100k', '$100k - $250k', '$250k - $500k', '$500k - $1M', '$1M+'],
        msgLabel: '其他细节',
        msgPlaceholder: '请简述您的项目...',
        amountLabel: '贷款金额 ($)',
        valueLabel: '估算物业价值 ($)',
        durationLabel: '贷款时长',
        durationOptions: ['少于 6 个月', '6-12 个月', '12-24 个月', '超过 24 个月'],
        termsLabel: '我确认此贷款仅限商业用途，并接受服务条款与隐私政策。',
        termsTitle: '服务条款与隐私政策',
        termsContent: '本服务由 FNH Capital 提供。我们的贷款仅限商业用途。点击提交即表示您同意以下内容：1. 信息收集：我们收集您的联系方式和房产信息用于贷款评估。2. 隐私保護：我们不会将您的个人数据出售给第三方。3. 商业用途确认：您确认借款用途为商业而非个人自住。4. 资格审查：所有贷款申请需经过我们的风险评估与承保标准。',
        ltvWarning: '贷款价值比 (LTV) 超过 70%。建议您直接拨打 408-800-5326 与我们沟通。',
        humanCheck: '人类验证',
        humanError: '请先完成验证码计算。',
        submit: '提交咨询',
        success: '提交成功！',
      },
    },
    footer: {
      description: '为现代房地产投资者提供专业贷款方案。快速、可靠、透明。',
      quickLinks: '快速链接',
      legal: '法律信息',
      contact: '联系方式',
      hours: '周一至周五: 9:00 AM - 6:00 PM',
      rights: '保留所有权利。',
      equalHousing: '平等住房机会',
    },
    investors: {
      badge: '投资者专区',
      title: '获取月度被动收入\n年化收益率 8.25%-11%',
      desc: '投资于受房地产资产抵押保护的第一信托契据（First Trust Deeds）。我们提供透明、安全的投资机会，助力资产稳健增值。',
      benefits: [
        {
          title: '高收益',
          desc: '年化收益率通常在 8.25% 至 11% 之间。'
        },
        {
          title: '资产保障',
          desc: '所有投资均由实物房地产资产抵押担保。'
        },
        {
          title: '月度派息',
          desc: '每月定期获得利息分配，实现稳定的现金流。'
        },
        {
          title: '专业风控',
          desc: '深度的尽职调查和严格的承保标准，降低投资风险。'
        }
      ],
      cta: '联系投资专员',
      secondaryCta: '了解更多',
      faq: [
        {
          q: '什么是信托契据 (Deed of Trust)？',
          a: '在美国房地产中，信托契据是将房地产的合法所有权转让给受托人的契据，受托人将其作为借款人和贷方之间贷款的担保。衡平所有权仍由借款人持有。'
        },
        {
          q: '什么是硬资产贷款 (Hard Money Loan)？',
          a: '硬资产贷款是一种特定类型的资产抵押贷款融资，借款人通过实物房产担保获得资金。硬资产贷款通常由私人投资者或公司发行。'
        },
        {
          q: '为什么选择我们？',
          a: '您的投资受信托契据担保，且收入稳定。大多数情况下，最高组合贷款价值比 (CLTV) 不超过 70%。我们是旧金山湾区的当地专家，深耕湾区房地产和贷款业务。'
        },
        {
          q: '我的投资保障是什么？',
          a: '我们深谙湾区市场。贷款文件由专业律师准备，产权保险提供 125% 的超额保额。资金可直接电汇至受监管的产权公司，确保交易透明安全。'
        },
        {
          q: '我可以查阅投资的所有文件吗？',
          a: '是的。所有投资者都可以完全访问相关交易文件，包括购买协议、初步产权报告、借款人信息、贷款文件及签字副本、最终经纪人包。'
        },
        {
          q: '我的投资回报率是多少？',
          a: '目前我们的硬资产贷款年化回报率通常在 8.25% 至 11% 之间。'
        },
        {
          q: '什么是点数 (Points)？',
          a: '点数是借款人为支付贷款发起和管理成本而支付的费用。'
        },
        {
          q: '借款人必须购买保险吗？',
          a: '是的。所有借款人必须购买产权保险和房屋保险，并将投资者列为保单受益人，提供全方位违约保护。'
        },
        {
          q: '你们提供第二顺位抵押吗？',
          a: '是的，但我们 80% 的业务集中在第一顺位。如果 CLTV 低于 50%，我们会根据房产价值和市场情况考虑第二顺位。'
        },
        {
          q: '合作的产权公司有哪些？',
          a: '我们长期合作的顶级公司包括：Fidelity Title, Chicago Title, Old Republic Title, North American Title, Orange Coast Title。'
        },
        {
          q: '我可以咨询你们的律师吗？',
          a: '可以。我们向所有投资者公开法律顾问的联系方式，您可以直接咨询法律细节（律师可能会根据咨询内容收费）。'
        },
        {
          q: '如果借款人违约，投资如何得到保障？',
          a: '在加州，非司法止赎（Non-judicial Foreclosure）是主要方式。如果发生违约，我们可以通过履行信托契据中的“销售权”（Power of Sale）条款，由受托人启动止赎流程，最终通过拍卖房产来收回投资本金。'
        },
        {
          q: '加州的止赎流程通常需要多长时间？',
          a: '对于非司法止赎，通常需要大约 4 个月。流程包括：发送违约通知 (NOD) 后有 90 天的等待期，随后是 21 天的信托拍卖通知 (NOTS) 期，最后进行拍卖。'
        },
        {
          q: '什么是司法与非司法止赎？',
          a: '加州主要使用非司法止赎，这种流程更快且无需通过法院，主要依据信托契据中的条款。司法止赎则需经过法院诉讼，通常仅在特殊或复杂情况下使用。'
        },
        {
          q: '如果借款人在止赎期间申请破产 (BK) 怎么办？',
          a: '申请破产会触发“自动中止”(Automatic Stay)，暂时停止止赎。但是，我们可以通过向法院提交“解除自动中止动议”(Motion for Relief from Stay) 来恢复流程，特别是对于非自住物业，这种申请通常会被批准。'
        },
        {
          q: '止赎拍卖后是否需要进行驱逐 (Eviction)？',
          a: '如果拍卖后原业主或租客仍占用房产，则可能需要启动正式的驱逐程序（Unlawful Detainer）。在加州，这通常会为资产回收时间表增加 30-90 天。我们会协助投资者处理此类法律程序。'
        }
      ]
    }
  },
  en: {
    nav: {
      services: 'Services',
      deals: 'Deals',
      about: 'About',
      contact: 'Contact',
      investors: 'Investors',
      apply: 'Apply Now',
      admin: 'Admin',
    },
    hero: {
      badge: 'Your Trust, Our Commitment',
      title: 'Professional Real Estate Loan Solutions',
      subtitle: 'Fast, reliable, and transparent financing for the modern real estate investor.',
      cta: 'Get Started',
      secondaryCta: 'View Deals',
      fastClosing: 'Fast Closing',
      fastClosingSubtitle: 'In as little as 14 days',
      fastClosingDesc: 'Our technology-driven process ensures your deals close when you need them.',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive solutions for all your financing needs',
      items: {
        residential: {
          title: 'Residential Loans',
          desc: 'Flexible residential loan options for homebuyers or refinancing.',
          points: ['1-4 Units', 'Purchase or Refi', 'Foreign National Friendly', 'Fast Approval']
        },
        commercial: {
          title: 'Commercial Loans',
          desc: 'Customized commercial financing for multi-family, office, and retail.',
          points: ['5+ Units', 'Office & Retail', 'Flexible Terms', 'Competitive Rates']
        },
        bridge: {
          title: 'Bridge Financing',
          desc: 'Short-term financing solutions to help you seize investment opportunities.',
          points: ['Quick Funding', 'Short-term', 'Fix & Flip', 'Asset-based']
        }
      },
      getStarted: 'Get Started'
    },
    deals: {
      title: 'Recent Deals',
      subtitle: 'Recently funded projects showcasing our capabilities.',
      addBtn: 'Post New Deal',
      editBtn: 'Edit Deal',
      deleteBtn: 'Delete Deal',
      form: {
        newTitle: 'Post New Deal Update',
        editTitle: 'Edit Deal Update',
        titleLabel: 'Title',
        descLabel: 'Description',
        statusLabel: 'Status',
        amountLabel: 'Loan Amount ($)',
        rateLabel: 'Interest Rate',
        periodLabel: 'Loan Period',
        locationLabel: 'Location',
        typeLabel: 'Property Type',
        imageLabel: 'Property Image',
        upload: 'Upload Image',
        change: 'Change Image',
        saveBtn: 'Post Update',
        updateBtn: 'Update Deal',
        statusActive: 'Active',
        statusClosed: 'Closed',
        statusFunding: 'Funding',
        progressLabel: 'Funding Progress (%)',
        stillNeeded: 'still needed',
        fullyFunded: 'Fully Funded'
      }
    },
    about: {
      badge: 'About FNH CAPITAL',
      title: 'Your Strategic Partner in Bay Area Real Estate',
      philosophy: 'Our Philosophy',
      philosophyText: 'At FNH Capital, we are dedicated to providing secure, asset-backed investment opportunities through First Trust Deeds in the San Francisco Bay Area. Our deep local expertise ensures your principal is protected by high-quality real estate collateral.',
      stats: {
        experience: 'Experience',
        quote: 'Quote',
        close: 'Close'
      }
    },
    contact: {
      badge: 'CONTACT US',
      title: 'Contact Us',
      subtitle: 'Ready to Fund Your Next Opportunity?',
      email: 'Email Us',
      phone: 'Call Us',
      office: 'Office',
      wechat: 'WeChat',
      desc: 'Speak with one of our specialized loan officers today for a no-obligation quote on your residential or commercial project.',
      form: {
        title: 'Loan Inquiry Form',
        nameLabel: 'Full Name',
        emailLabel: 'Email Address',
        typeLabel: 'Loan Type',
        roleLabel: 'I am a',
        roleBorrower: 'Borrower',
        roleInvestor: 'Investor',
        accreditedLabel: 'I am an Accredited Investor',
        investAmountLabel: 'Planned Investment Amount',
        investAmountOptions: ['Less than $100k', '$100k - $250k', '$250k - $500k', '$500k - $1M', '$1M+'],
        msgLabel: 'Additional Details',
        msgPlaceholder: 'Briefly describe your project...',
        amountLabel: 'Loan Amount ($)',
        valueLabel: 'Estimated Property Value ($)',
        durationLabel: 'Loan Duration',
        durationOptions: ['Less than 6 months', '6-12 months', '12-24 months', 'Over 24 months'],
        termsLabel: 'I confirm this loan is for commercial purpose only and accept terms & privacy policy.',
        termsTitle: 'Terms of Service & Privacy Policy',
        termsContent: 'By using our services, you agree to the following: 1. Commercial Purpose: All loans are for business or investment purposes only, not for personal use. 2. Information Security: We use industry-standard measures to protect your data. 3. Data Usage: We use your information to provide quotes and underwriting services; we do not sell your data. 4. Qualifications: All financing is subject to property appraisal and final underwriting approval.',
        ltvWarning: 'Loan-to-Value (LTV) is over 70%. We recommend calling us at 408-800-5326 to discuss.',
        humanCheck: 'Human Check',
        humanError: 'Please complete the captcha correctly.',
        submit: 'Submit Inquiry',
        success: 'Submitted Successfully!',
      },
    },
    footer: {
      description: 'Specialized lending solutions for the modern real estate investor. Fast, reliable, and transparent.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      contact: 'Contact',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      rights: 'All rights reserved.',
      equalHousing: 'Equal Housing Opportunity',
    },
    investors: {
      badge: 'INVESTOR PORTAL',
      title: 'Monthly Passive Income\nWith 8.25-11% Annual Return',
      desc: 'Invest in safe, asset-backed opportunities through First Trust Deeds. Our rigorous underwriting ensures your principal is protected by high-quality real estate collateral.',
      benefits: [
        {
          title: 'High Yield',
          desc: 'Earn competitive annual returns ranging from 8.25% to 11%.'
        },
        {
          title: 'Asset Protection',
          desc: 'Every investment is secured by physical real estate as collateral.'
        },
        {
          title: 'Monthly Income',
          desc: 'Receive regular monthly interest distributions for consistent cash flow.'
        },
        {
          title: 'Expert Underwriting',
          desc: 'Benefit from our deep domain expertise and strict risk management protocols.'
        }
      ],
      cta: 'Speak with an Investment Specialist',
      secondaryCta: 'Learn More',
      faq: [
        {
          q: "What's A Deed of Trust?",
          a: "In real estate in the United States, a deed of trust or trust deed is a deed wherein legal title in real property is transferred to a trustee, which holds it as security for a loan between a borrower and lender. The equitable title remains with the borrower."
        },
        {
          q: "What's A Hard Money Loan?",
          a: "A hard money loan is a specific type of asset-based loan financing through which a borrower receives funds secured by real property. Hard money loans are typically issued by private investors or companies."
        },
        {
          q: "Why Invest with us?",
          a: "Your investment is secured by a deed of trust & your income is steady. Most of the time, the MAX CLTV is no more than 70%. We are a local real estate broker in San Francisco Bay Area. We only do real estate & loans in Bay Area."
        },
        {
          q: "What's My Protection?",
          a: "We know the Bay Area Real Estate Market; Loan Docs will be prepared by our attorney. Title Insurance will have 125% coverage. You can wire the fund directly to the title if you want."
        },
        {
          q: "Do I have Access to All the Files of My Investment?",
          a: "Yes. All the investors will have access to that transaction, including all files, such as the Purchase Agreement, Prelim Report, Borrower's information, Loan Docs & Signed Copy, and Final Broker Package."
        },
        {
          q: "What's the Return of My Investment?",
          a: "The annual return for our hard money loans is currently 8.25%-11%."
        },
        {
          q: "What Are The Points?",
          a: "Points are the fees paid by the borrower to cover the cost of origination and brokerage in a hard money loan transaction."
        },
        {
          q: "Will You Ask All The Borrowers to Purchase Insurance?",
          a: "Yes, absolutely. We will ask them to purchase title insurance & home insurance. Investors will be named as beneficiaries."
        },
        {
          q: "Do You Offer 2nd Position of Deed of Trust?",
          a: "Yes, but 80% of our current loans are the first deed. If CLTV is less than 50%, we may do the second. It all depends on the property value & R.E market."
        },
        {
           q: "Which Title Companies Have You Worked With?",
           a: "We work with major title companies including Fidelity Title, Chicago Title, Old Republic Title, North American Title, and Orange Coast Title."
        },
        {
           q: "Can I Contact Your Attorney?",
           a: "Yes. Our attorney's contact information is available to all our investors. Feel free to contact them if you have any legal questions regarding trust deed investment (consultation fees may apply)."
        },
        {
          q: "What's my protection if a borrower defaults?",
          a: "In California, non-judicial foreclosure is the primary method. If a default occurs, we can exercise the 'Power of Sale' clause in the Deed of Trust. The trustee initiates the foreclosure process, culminating in a public auction of the property to satisfy the debt."
        },
        {
          q: "How long does the foreclosure process take in CA?",
          a: "For a non-judicial foreclosure, it typically takes about 4 months. The process involves a 90-day waiting period after recording a Notice of Default (NOD), followed by a 21-day Notice of Trustee's Sale (NOTS) period before the auction can occur."
        },
        {
          q: "What is the difference between Judicial vs. Non-Judicial Foreclosure?",
          a: "California is primarily a non-judicial foreclosure state, which is faster and doesn't require court intervention as long as the Deed of Trust includes a 'Power of Sale' clause. Judicial foreclosure involves a lawsuit through the court system and is much rarer, usually reserved for complex cases."
        },
        {
          q: "What if the borrower files for Bankruptcy (BK) during foreclosure?",
          a: "A bankruptcy filing triggers an 'automatic stay,' which temporarily halts the foreclosure. However, we can file a 'Motion for Relief from Stay' to resume the process. For non-owner occupied properties, these motions are commonly granted, allowing us to proceed with the sale."
        },
        {
          q: "Do we need to handle evictions after the foreclosure auction?",
          a: "If the property is occupied by the former owner or a tenant after the sale, a formal eviction process (unlawful detainer) may be required. In California, this typically adds 30-90 days to the recovery timeline. Our team assists in coordinating these legal steps."
        }
      ]
    }
  }
};
