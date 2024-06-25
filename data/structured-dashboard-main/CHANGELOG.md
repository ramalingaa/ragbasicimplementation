# [0.6.0](https://github.com/StructuredLabs/structured-dashboard/compare/v0.5.0...v0.6.0) (2024-05-15)


### Bug Fixes

* **harbor:** Create bigquery datasets for old workspaces ([8cc46a5](https://github.com/StructuredLabs/structured-dashboard/commit/8cc46a5015fec93d3ab8434b3857869f0d970b3e))
* **harbor:** Fix harbor source graph crash ([00c79b8](https://github.com/StructuredLabs/structured-dashboard/commit/00c79b852f68adca81705780b06b9fa0b37a5a71))
* **harbor:** Graph edges are repeated ([0f32d54](https://github.com/StructuredLabs/structured-dashboard/commit/0f32d54a064a1c8ccda26527d5c375ed60574057))
* **home-report:** adjust spacing, unify chart box styles with descriptions, modify kebab menu visibility, and correct page regeneration trigger ([2afa522](https://github.com/StructuredLabs/structured-dashboard/commit/2afa522bd1e8708955a50815f415d913479e46b7))
* **useCsvConnection:** Check for undefined array buff's ([947fe6d](https://github.com/StructuredLabs/structured-dashboard/commit/947fe6d0c07d4bd9c2631a51bf0e913daa46ef4f))


### Features

* **alerts:** setup initial UI ([70b1074](https://github.com/StructuredLabs/structured-dashboard/commit/70b10742338e85774fdeb449a71963e7288fe6e3))
* **blocks:** implement customer health scoring flow route ([dbe71b2](https://github.com/StructuredLabs/structured-dashboard/commit/dbe71b2f718b4e0508dc60d0500d15df8c7969da))
* **blocks:** populate flow results data in block detail ([8fcf521](https://github.com/StructuredLabs/structured-dashboard/commit/8fcf5219352657c0f5a4db77ea83e81fb9db1747))
* **container:** create block details container ([71468e3](https://github.com/StructuredLabs/structured-dashboard/commit/71468e323bbedb6fbe85e01298c3e1c124690a3a))
* **harbor:** Add GCP bigquery Utils ([5d09f5d](https://github.com/StructuredLabs/structured-dashboard/commit/5d09f5d838d076d51a361b47f59b744d772ccae7))
* **harbor:** Add sources data to bigquery ([8caf685](https://github.com/StructuredLabs/structured-dashboard/commit/8caf6857e229575271aebd34d0bf733c81e6e232))
* **report:** add logo to home Ops Overview report ([6638348](https://github.com/StructuredLabs/structured-dashboard/commit/66383484b895176616e59e36d606143bc811faba))
* **report:** add workspace name to home Ops Overview report ([a88ce3c](https://github.com/StructuredLabs/structured-dashboard/commit/a88ce3c938e1e1191f8912e93c516a4e661c7520))
* **reports:** edit 'Regenerate' button to icon only, ghost variant ([78f9134](https://github.com/StructuredLabs/structured-dashboard/commit/78f9134b2199db8c8e366fd7bf02cc53e19490f2))
* **reports:** Share viewable link ([b0beb22](https://github.com/StructuredLabs/structured-dashboard/commit/b0beb2208c835a9f6285e548c281e3037789f051))
* **settings:** add workspace image setting ([1fc37ca](https://github.com/StructuredLabs/structured-dashboard/commit/1fc37ca833499937e110226756fd5e6fcf4cc490))
* **ui:** create initial UI for blocks ([4481fe9](https://github.com/StructuredLabs/structured-dashboard/commit/4481fe9ad5e5cd19dabc16e68ed68689b33014ee))
* **workspace:** implement save image functionality ([f5f74e6](https://github.com/StructuredLabs/structured-dashboard/commit/f5f74e618180cb9ddeebac514a9c1a1782ef1228))

# [0.5.0](https://github.com/StructuredLabs/structured-dashboard/compare/v0.4.0...v0.5.0) (2024-05-13)


### Bug Fixes

* **harbor:** Add atleast one edge btw sources ([436189a](https://github.com/StructuredLabs/structured-dashboard/commit/436189ae7244768c5b1ae491f2af09818d6bf120))
* **harbor:** Add csv data from entity type files into rds db ([a555c4e](https://github.com/StructuredLabs/structured-dashboard/commit/a555c4ed5c2d4789b08b7eb4748b4942879c74cc))
* **harbor:** Add try catch block to clear db conn details in workspace table ([37c43fb](https://github.com/StructuredLabs/structured-dashboard/commit/37c43fbf34de408cfc8887ea6b7b0aeaaf0aaa1b))
* **harbor:** e2e found bugs resolved ([9c2e571](https://github.com/StructuredLabs/structured-dashboard/commit/9c2e57191e2ab85fe0a7f0b12d3e7d18e7bc4cdf))
* **harbor:** Fix missing units from disaplying on screen ([773d609](https://github.com/StructuredLabs/structured-dashboard/commit/773d609e76247927d2c224069a33526c083e3e9b))
* **harbor:** Fix psql version for aws instance ([e5353de](https://github.com/StructuredLabs/structured-dashboard/commit/e5353de83e67040ec4390c27c85a13f26401fa71))
* **harbor:** Fix workspace switch on units page ([2506533](https://github.com/StructuredLabs/structured-dashboard/commit/2506533bd10bb3a7dcdf0ed42b534a8a3fe9bcc5))
* **harbor:** Fix workspace switching bug from units page ([60ad580](https://github.com/StructuredLabs/structured-dashboard/commit/60ad5803fd7f93de8ae5ee38f38964b2934c812c))
* **harbor:** Reload graph views on entities and sources change ([46b33fb](https://github.com/StructuredLabs/structured-dashboard/commit/46b33fb1a9e0e31213d657c4ef61276424cf4f26))
* **harbor:** Remove placeholder texts on db conn modal ([bdfb669](https://github.com/StructuredLabs/structured-dashboard/commit/bdfb66920821c1fc4fdcaa8cd6864da60beb5ccd))
* **harbor:** Remove reactflow default elements positioning ([f6b2de2](https://github.com/StructuredLabs/structured-dashboard/commit/f6b2de2a70fca81c789bd595eee8adac364d306c))
* **harbor:** Show only original sources in source graph ([d4ddc91](https://github.com/StructuredLabs/structured-dashboard/commit/d4ddc9193a76a6e4dc94cfb835d8319fec7efe32))
* **harbor:** switch btw horizontal and vertical dagre graph layouts ([a7a3713](https://github.com/StructuredLabs/structured-dashboard/commit/a7a37131228d5ef753ab0822693db2bb3640e6a2))
* **magic-button:** fix queries flow and return key handling ([604ec41](https://github.com/StructuredLabs/structured-dashboard/commit/604ec4153e3b70c67bc539bd54f49e434750a5b0))
* **queries:** Data tab error handling ([8590970](https://github.com/StructuredLabs/structured-dashboard/commit/8590970838985f92b42f6aad674d481ddd2bc141))
* **queries:** Fix rendering logic of queries charts ([aca2ba0](https://github.com/StructuredLabs/structured-dashboard/commit/aca2ba0977eac46e36becf89415314cb467a307d))
* **queries:** Make new queries dropdown scrollable ([d5c6614](https://github.com/StructuredLabs/structured-dashboard/commit/d5c66140fbc0ca4c09c8aa892acc555ecd8ad395))


### Features

* **harbor:** Add dagre to spread out the datasource tables in graph ([9244e96](https://github.com/StructuredLabs/structured-dashboard/commit/9244e9646969522d91f36465e6791d1ad83ebb51))
* **harbor:** Add entity graph view as sql schema view ([d588c70](https://github.com/StructuredLabs/structured-dashboard/commit/d588c70d5850721dd666af801811a6e8b2d0dc8a))
* **harbor:** Init sql schema visualiser ui files ([742a459](https://github.com/StructuredLabs/structured-dashboard/commit/742a45936469399f210fea36a6f87fafb996f1e8))
* **harbor:** Intro debounced search feature for units page ([563a2a4](https://github.com/StructuredLabs/structured-dashboard/commit/563a2a423335cd91e15d7e9a7df23b2a4e56dada))
* **harbor:** Migrate sources graph to sql schema view design ([1e62d07](https://github.com/StructuredLabs/structured-dashboard/commit/1e62d07ebb790c1adef48298c0aefcdcea1adb5a))
* **harbor:** Store Units in allocated AWS RDS to get conn details ([8d26e73](https://github.com/StructuredLabs/structured-dashboard/commit/8d26e7335a10fe2b3fbf4f596429715ab2430f12))
* **queries:** Add inline mentions in queries textarea ([0e5ef8e](https://github.com/StructuredLabs/structured-dashboard/commit/0e5ef8ec07627681e8c1f14a98aa4a8f61a20c62))
* **queries:** Enable copying a viewable link to a query ([f109d34](https://github.com/StructuredLabs/structured-dashboard/commit/f109d34c619902d0f288935b45c961d2818fc0d1))
* **queries:** Migration from charts.js to apache echarts ([b43f432](https://github.com/StructuredLabs/structured-dashboard/commit/b43f4324e3bd1aa28ed5828baa66d7280cff3873))
* **report:** make home report title default ([0ee8665](https://github.com/StructuredLabs/structured-dashboard/commit/0ee8665ee6b9f9cfa98db09854d4854fe6ef5d4b))
* **reports:** integrate TextBox component, merge report modal views, and preserve TextBox states across sessions; fix issue with deleting multiple reports ([8820feb](https://github.com/StructuredLabs/structured-dashboard/commit/8820feb981cf7b780ef3f7db17ec6d143a474bf6))
* **reports:** preserve charts sizes and positions on edit and view mode, use 'react-grid-layout' in view mode to preserve styling (lock mode), prevent text input in text boxes and disable drill downs in view mode, maintain textbox HTML styling across view and edit modes, fix 'Add bookmarked queries' dropdown getting cut off by modal, enable drilldown on view mode vs. delete on edit and creation ([9c3af5a](https://github.com/StructuredLabs/structured-dashboard/commit/9c3af5ade682d1b294b08926ca55f034f1240f82))


### Performance Improvements

* **reports:** for drilldown not new query, go back to old one, make 2 dots icon click area larger in reports card, make box components content scrollable, queryItem component render natural language answer ([813c985](https://github.com/StructuredLabs/structured-dashboard/commit/813c98506b74999a67bea4d04254545a3013ac0c))
* trigger 'I'm Feeling Lucky' flow on new home page ([06742bc](https://github.com/StructuredLabs/structured-dashboard/commit/06742bca5aa39b7ccbbbdce65ae47be1fb96441f))
* trigger 'I'm Feeling Lucky' flow on new home page, update home report summary as soon as response is obtained, load questions before everything else, fix home report replacement in store, trigger home report generation when visiting home page, secondary top bar button in home page ([f2dd033](https://github.com/StructuredLabs/structured-dashboard/commit/f2dd033ae3dd39fdab1bd452329d8763340a7b27))


### Reverts

* **harbor:** Revert source page as default harbor page ([4f7a9c6](https://github.com/StructuredLabs/structured-dashboard/commit/4f7a9c6b51234b0df72bd910b6fd70a40cca25fd))

# [0.4.0](https://github.com/StructuredLabs/structured-dashboard/compare/v0.3.0...v0.4.0) (2024-05-03)


### Bug Fixes

* **api:** Add max duration for join tables api ([d696d1a](https://github.com/StructuredLabs/structured-dashboard/commit/d696d1aedeab404e8199f89bc0e3296c7b2cf29c))
* **api:** Add try catch blocks for json parsing ([2b47f5f](https://github.com/StructuredLabs/structured-dashboard/commit/2b47f5f2d25a6eee793e5f77d2397a3b7146ca9a))
* **harbor:** Dataviewmodel resetting tabs ([81328f5](https://github.com/StructuredLabs/structured-dashboard/commit/81328f50d82181612046d95ad4773aef076ce667))
* **harbor:** Ensure type graph to fit to view ([6a224f5](https://github.com/StructuredLabs/structured-dashboard/commit/6a224f5f875bfd7c0ad5dede155908fb93f9d91e))
* **harbor:** new datasources ret type is not same as fetch datasources api call ret type ([a5a2cc4](https://github.com/StructuredLabs/structured-dashboard/commit/a5a2cc46cdbc8c17d955d7488efab70567ed8654))
* **harbor:** Secondary top bar source-type-unit dropdown not getting updated on workspace change ([ef855d8](https://github.com/StructuredLabs/structured-dashboard/commit/ef855d8139dff11c34d2187213b35496d8fb299e))
* **harbor:** Set max timeout for vercel env ([f668305](https://github.com/StructuredLabs/structured-dashboard/commit/f6683059b4e4a274a0dd57001702ceacdf65693f))
* **harbor:** Shift dev to prod for entity types ([edf98ba](https://github.com/StructuredLabs/structured-dashboard/commit/edf98baf5c162a5667385b2c6c43bb4f72503110))
* **harbor:** Validate spreadsheets size before upload ([60c1a99](https://github.com/StructuredLabs/structured-dashboard/commit/60c1a991ac92ece8dbcf61f38ac9f899d14acd8e))


### Features

* **harbor:** [Graph View][M] Make it so that 'selecting' nodes in the reactflow == checkbox getting selected in the file view ([a763168](https://github.com/StructuredLabs/structured-dashboard/commit/a7631686f889476283c73193f7f87678a56966e6))
* **harbor:** Add Unit Page with records from all entity files ([82b4782](https://github.com/StructuredLabs/structured-dashboard/commit/82b4782bc0d8a8b09f39170759e0d73c0365b111))
* **harbor:** Build Type page ([92621c7](https://github.com/StructuredLabs/structured-dashboard/commit/92621c7f79b74d4778873722d35686bad50d0704))
* **harbor:** Introduce entity types table ([6af424d](https://github.com/StructuredLabs/structured-dashboard/commit/6af424d5ee7392417cd9700b051e4be8a4226c4e))
* **harbor:** Introduce Unit Page with all records from all datasources ([7114af8](https://github.com/StructuredLabs/structured-dashboard/commit/7114af8a4b20829f52dd0ea09439ca41cfebf377))
* **harbor:** Make Table and Graph width/heights adjustable ([fc6e03b](https://github.com/StructuredLabs/structured-dashboard/commit/fc6e03b11e6b5bcc9eca8f59b8e49ee3e75819c6))
* **reports:** Clear report boxes when creating a new report ([1e3e5b7](https://github.com/StructuredLabs/structured-dashboard/commit/1e3e5b78615aa8b281f1547fd0845711389193f0))
* **reports:** Remove file dropdown from reports ([37120ee](https://github.com/StructuredLabs/structured-dashboard/commit/37120ee0f47bd5127f569460a93102c95960623f))
* **reports:** Save boxes position in store ([e9d39ca](https://github.com/StructuredLabs/structured-dashboard/commit/e9d39ca9e2ec75d8cbe7cb876c06dd2622432581))

# [0.3.0](https://github.com/StructuredLabs/structured-dashboard/compare/v0.2.0...v0.3.0) (2024-04-27)


### Bug Fixes

* **secondary_top_bar:** Fix missing dropdown ([4fd1aab](https://github.com/StructuredLabs/structured-dashboard/commit/4fd1aab3110445a6973aece95e2c1b520642aead))


### Features

* **graph:** Migrate react-vis-graph to reactflow ([3ccbdc3](https://github.com/StructuredLabs/structured-dashboard/commit/3ccbdc3c3e28f3bbf4589070b6b6493c6c378437))
* **harbor:** Add dropdown for source, type and unit selection ([158cb07](https://github.com/StructuredLabs/structured-dashboard/commit/158cb07110fddc88289d772ef62089823b2ddd1b))
* **harbor:** Add split view of list view and graph view ([e1e35a5](https://github.com/StructuredLabs/structured-dashboard/commit/e1e35a561e2ab89dfedbb16e268830f28f55b809))
* **harbor:** Move graph view (on data preview Modals > Associations for joined files) to react flow ([cc78bf8](https://github.com/StructuredLabs/structured-dashboard/commit/cc78bf8ee4a4ea7bc6ad661d19216a1a0ab52730))

# [0.2.0](https://github.com/StructuredLabs/structured-dashboard/compare/v0.1.0...v0.2.0) (2024-04-25)


### Features

* **bookmark:** Make Query slides bookmarkable ([4b74a17](https://github.com/StructuredLabs/structured-dashboard/commit/4b74a176b6f26f923d4d80a740bb15d551140654))

# [0.1.0](https://github.com/StructuredLabs/structured-dashboard/compare/v0.0.12...v0.1.0) (2024-04-25)


### Bug Fixes

* Remove semantic-release ci/cd & adjust edges length in graph ([cedfa3d](https://github.com/StructuredLabs/structured-dashboard/commit/cedfa3d2ddf7cce3d28827b42240e9118352bb60))


### Features

* [Harbor][Bug] Registry getting mounted and fetching datasources unwantedly ([6031fe9](https://github.com/StructuredLabs/structured-dashboard/commit/6031fe99d45c7e43ae42961b1265d123f32a52ed))
* sync package-lock.json ([0484167](https://github.com/StructuredLabs/structured-dashboard/commit/04841677c7af576d523fd18cc0fc687d1e7bbb61))
