# Text Card

***This is a forked version of the original Text Card Mod. In this version, we add basic search and highlighting capabilities, just as a POC***

![](textmod.gif) 


The Text Card product for the TIBCO Spotfire® environment is an extension used to visualize text data in an efficient and esthetical way, often alongside other data visualizations. 

Project for Software innovation course at [Gothenburg University](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwjN8vmW55jtAhVkmIsKHQtEBgIQFjAAegQIBBAC&url=https%3A%2F%2Fkursplaner.gu.se%2Fpdf%2Fkurs%2Fen%2FDIT827&usg=AOvVaw3_5kJeDs3_ov4auh2zQxuZ) and [TIBCO Spotfire®](https://www.tibco.com/products/tibco-spotfire)

## Getting started
Visit the project's [website](https://hajke-gu.github.io/text-mod/) for a user guide of the Text Card mod.

To run (and modify) the Text Card mod locally, please follow these steps:


### Prerequisites
These instructions assume that you have [Node.js](https://nodejs.org/en/) (which includes npm) installed.

### How to get started (with development server)
- Open a terminal at the location of the downloaded/cloned Text Card mod repository.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm run server`. This will start a development server.
- Start editing, for example `src/main.js`.
- In Spotfire®, follow the steps of creating a new mod and connecting to the development server.

## Descriptions

### Architecture
The text card mod is created inside a sandboxed iframe within the Spotfire® environment. It communicates solely with the Spotfire® API. More information can be found in the Spotfire® Mods documentation.
The code is split in three files roughly according to the tasks.
</br>
<img width="500" alt="architecture" src="https://user-images.githubusercontent.com/43996812/102020133-78155a80-3d77-11eb-8f59-acebebb2d9f7.png">

### Custom theme adaption
The text card mod uses the following styling elements supplied by the Spotfire® Mods API:
- general.font: Annotation and content font styling, text-card-border mouse-over line, buttons and scrollbars adapt to it (using different opacity levels)
- scales.line.stroke: Box shadow of text card
- scales.tick.stroke: Seperation line between annotation and content (thin_hr), seperation line between annotations

## Authors

-   **Hartmut Fischer** - _Project owner_ - [HarFis](https://github.com/HarFis)
-   **Karl Westgårdh** - _Project owner_ - [Synoecism](https://github.com/Synoecism)
-   **Jonatan Vaara** - _Project owner_ - [JonatanVaara](https://github.com/JonatanVaara)
-   **Alexander Strand** - _Project owner_ - [strand93](https://github.com/strand93)
-   **Emanuel Dellsen** - _Project owner_ - [EmanuelDellsen](https://github.com/EmanuelDellsen)

## Acknowledgments

Thanks to the team at [TIBCO Spotfire®](https://www.tibco.com/products/tibco-spotfire) for all the support in the development of this extension as well as for developing the environment in which this extension has been constructed and to our academic supervisor [Miroslaw Staron](https://www.gu.se/en/about/find-staff/miroslawstaron) from Gothenburg University.

## License

This project is licensed under the [MIT License](LICENSE.md).